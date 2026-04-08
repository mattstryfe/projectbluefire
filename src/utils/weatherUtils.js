import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export const PROPERTY_MODES = {
  POINT: 'point',
  ACCUMULATE: 'accumulate',
  HOURLY: 'hourly'
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

  precipData.forEach(({ time, value, durationHours }) => {
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
