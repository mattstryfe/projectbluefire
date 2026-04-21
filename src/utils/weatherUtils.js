import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export const PROPERTY_MODES = {
  POINT: 'point',
  ACCUMULATE: 'accumulate',
  HOURLY: 'hourly'
}

export function buildDailyData(raw) {
  const {
    temperature,
    apparentTemperature,
    windSpeed,
    probabilityOfPrecipitation,
    quantitativePrecipitation,
    maxTemperature,
    minTemperature
  } = raw

  // Derive date range from all hourly arrays combined, not just temperature
  const allTimes = [
    ...temperature,
    ...apparentTemperature,
    ...windSpeed,
    ...probabilityOfPrecipitation
  ]

  const dateSet = [
    ...new Set(allTimes.map((e) => dayjs(e.time).format('YYYY-MM-DD')))
  ].sort()

  // Build the skeleton from the date range itself
  const grouped = dateSet.reduce((acc, date) => {
    acc[date] = {
      date,
      label: dayjs(date).format('ddd'),
      daily: {
        high: null,
        low: null,
        probabilityOfPrecipitation: null,
        windSpeed: null
      },
      hourly: {
        temperature: [],
        apparentTemperature: [],
        windSpeed: [],
        probabilityOfPrecipitation: [],
        quantitativePrecipitation: []
      }
    }
    return acc
  }, {})

  // Fill hourly buckets
  const joinHourly = (arr, key) => {
    for (const entry of arr) {
      const date = dayjs(entry.time).format('YYYY-MM-DD')
      if (grouped[date]) grouped[date].hourly[key].push(entry)
    }
  }

  joinHourly(temperature, 'temperature')
  joinHourly(apparentTemperature, 'apparentTemperature')
  joinHourly(windSpeed, 'windSpeed')
  joinHourly(probabilityOfPrecipitation, 'probabilityOfPrecipitation')
  joinHourly(quantitativePrecipitation, 'quantitativePrecipitation')

  // Attach max/min by date string match
  const days = Object.values(grouped)

  days.forEach((day) => {
    const date = day.date

    // max/min from NWS arrays
    const maxEntry = maxTemperature.find(
      (e) => dayjs(e.time).format('YYYY-MM-DD') === date
    )
    const minEntry = minTemperature.find(
      (e) => dayjs(e.time).format('YYYY-MM-DD') === date
    )
    day.daily.high = maxEntry?.value ?? null
    day.daily.low = minEntry?.value ?? null

    // derived daily summaries from hourly
    const pop = day.hourly.probabilityOfPrecipitation
    const wind = day.hourly.windSpeed

    day.daily.probabilityOfPrecipitation = pop.length
      ? Math.max(...pop.map((e) => e.value))
      : null

    day.daily.windSpeed = wind.length
      ? Math.round(Math.max(...wind.map((e) => e.value)))
      : null
  })
  return days
}

export function processNWSGridData(gridpointData) {
  const { POINT, ACCUMULATE } = PROPERTY_MODES
  const props = gridpointData.properties

  return {
    temperature: processProperty(props.temperature, convertCelsiusToFahrenheit),
    apparentTemperature: processProperty(
      props.apparentTemperature,
      convertCelsiusToFahrenheit
    ),
    windSpeed: processProperty(props.windSpeed, convertKmhToMph),
    probabilityOfPrecipitation: processProperty(
      props.probabilityOfPrecipitation
    ),
    quantitativePrecipitation: processProperty(
      props.quantitativePrecipitation,
      convertMMtoIn,
      ACCUMULATE
    ),
    maxTemperature: processProperty(
      props.maxTemperature,
      convertCelsiusToFahrenheit,
      POINT
    ),
    minTemperature: processProperty(
      props.minTemperature,
      convertCelsiusToFahrenheit,
      POINT
    )
  }
}

export function findDayBoundaries(data) {
  const boundaries = []
  let currentDay = null

  data.forEach((item, index) => {
    const day = item.time.format('YYYY-MM-DD')
    if (day !== currentDay) {
      boundaries.push({ index, label: item.time.format('ddd') })
      currentDay = day
    }
  })

  return boundaries
}

export function processPrecipitationByDay(precipData) {
  const dailyTotals = {}

  precipData.forEach(({ time, value }) => {
    const dayKey = time.format('YYYY-MM-DD')
    if (!dailyTotals[dayKey]) {
      dailyTotals[dayKey] = { date: time.startOf('day'), totalIn: 0 }
    }
    dailyTotals[dayKey].totalIn += value ?? 0
  })

  return Object.values(dailyTotals)
    .sort((a, b) => a.date.valueOf() - b.date.valueOf())
    .map(({ date, totalIn }) => ({
      date,
      label: date.format('ddd'),
      totalIn: +totalIn.toFixed(2)
    }))
}

function processProperty(
  property,
  converter = (v) => v,
  mode = PROPERTY_MODES.HOURLY
) {
  if (!property?.values) return []

  const result = []

  property.values.forEach((item) => {
    const [startStr, durationStr] = item.validTime.split('/')
    const start = dayjs(startStr)
    const durationHours = dayjs.duration(durationStr).asHours()
    const value = item.value !== null ? converter(item.value) : null

    switch (mode) {
      case PROPERTY_MODES.POINT:
        result.push({ time: start, timestamp: start.valueOf(), value })
        break

      case PROPERTY_MODES.ACCUMULATE:
        result.push({
          time: start,
          timestamp: start.valueOf(),
          value,
          durationHours
        })
        break

      default:
        for (let i = 0; i < durationHours; i++) {
          const time = start.add(i, 'hour')
          result.push({ time, timestamp: time.valueOf(), value })
        }
    }
  })

  return result
}

function convertCelsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32
}
function convertKmhToMph(kmh) {
  return kmh * 0.621371
}
function convertMMtoIn(mm) {
  return Math.round(mm * 0.0393701 * 100) / 100
}
