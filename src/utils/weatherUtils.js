import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import { PROPERTY_MODES } from '@/config/appDefaults.js'

/* Maps NWS condition codes (parsed from icon URL path) to MDI icon strings.
   Day/night variants only matter for clear and partly-cloudy conditions. */
const NWS_MDI_MAP = {
  skc:             { day: 'mdi-weather-sunny',         night: 'mdi-weather-night' },
  few:             { day: 'mdi-weather-partly-cloudy', night: 'mdi-weather-night-partly-cloudy' },
  sct:             { day: 'mdi-weather-partly-cloudy', night: 'mdi-weather-night-partly-cloudy' },
  bkn:             'mdi-weather-cloudy',
  ovc:             'mdi-weather-cloudy',
  wind_skc:        'mdi-weather-windy',
  wind_few:        'mdi-weather-windy-variant',
  wind_sct:        'mdi-weather-windy-variant',
  wind_bkn:        'mdi-weather-windy-variant',
  wind_ovc:        'mdi-weather-windy',
  snow:            'mdi-weather-snowy',
  rain_snow:       'mdi-weather-snowy-rainy',
  sleet:           'mdi-weather-hail',
  fzra:            'mdi-weather-hail',
  rain_sleet:      'mdi-weather-snowy-rainy',
  snow_sleet:      'mdi-weather-snowy-rainy',
  blizzard:        'mdi-weather-snowy-heavy',
  snow_fzra:       'mdi-weather-snowy-rainy',
  rain_fzra:       'mdi-weather-hail',
  snow_showers:    'mdi-weather-snowy',
  snow_showers_hi: 'mdi-weather-snowy',
  tsra:            'mdi-weather-lightning-rainy',
  tsra_sct:        'mdi-weather-lightning-rainy',
  tsra_hi:         'mdi-weather-lightning',
  rain:            'mdi-weather-pouring',
  rain_showers:    'mdi-weather-rainy',
  rain_showers_hi: 'mdi-weather-rainy',
  fog:             'mdi-weather-fog',
  smoke:           'mdi-smoke',
  dust:            'mdi-weather-hazy',
  haze:            'mdi-weather-hazy',
  hot:             'mdi-thermometer-high',
  cold:            'mdi-snowflake',
  tornado:         'mdi-weather-tornado',
  hurricane:       'mdi-weather-hurricane',
  tropical_storm:  'mdi-weather-hurricane',
  dust_storm:      'mdi-weather-hazy',
}

/* Parses the NWS icon URL to extract condition code and day/night context,
   then returns the matching MDI icon string. Falls back to mdi-weather-cloudy.
   URL format: .../icons/land/{day|night}/{condition}[,{pop}][/{condition2}]?size=... */
export function getNWSConditionIcon(iconUrl) {
  if (!iconUrl) return 'mdi-weather-cloudy'
  const match = iconUrl.match(/\/land\/(day|night)\/([^?]+)/)
  if (!match) return 'mdi-weather-cloudy'
  const isDay = match[1] === 'day'
  const condition = match[2].split('/')[0].split(',')[0]
  const entry = NWS_MDI_MAP[condition]
  if (!entry) return 'mdi-weather-cloudy'
  if (typeof entry === 'string') return entry
  return isDay ? entry.day : entry.night
}

/* Sums quantitative precipitation entries for a single day (values already in inches).
   Isolated so only this function needs updating when TG-70 replaces the grid data source. */
export function getDailyPrecipTotal(quantPrecipEntries) {
  if (!quantPrecipEntries?.length) return 0
  const total = quantPrecipEntries.reduce((sum, e) => sum + (e.value ?? 0), 0)
  return Math.round(total * 100) / 100
}

/* Builds daily card data from the NWS hourly forecast periods array.
   Optionally merges grid-sourced quantitative precip totals per day (TG-70 will replace that source). */
export function buildDailyDataFromHourly(periods, gridQuantPrecip = []) {
  if (!periods?.length) return []

  const grouped = {}

  for (const period of periods) {
    const date = dayjs(period.startTime).format('YYYY-MM-DD')
    if (!grouped[date]) {
      grouped[date] = {
        date,
        label: dayjs(date).format('ddd'),
        daily: {
          high: null,
          low: null,
          probabilityOfPrecipitation: null,
          windSpeed: null,
          icon: null,
          shortForecast: null,
          precipTotal: null
        },
        hourly: {
          temperature: [],
          apparentTemperature: [],
          windSpeed: [],
          probabilityOfPrecipitation: [],
          relativeHumidity: [],
          dewpoint: []
        }
      }
    }

    const day = grouped[date]
    const temp = period.temperature
    const pop = period.probabilityOfPrecipitation?.value ?? 0
    const wind = parseWindSpeed(period.windSpeed)
    const time = dayjs(period.startTime)
    const timestamp = time.valueOf()

    if (period.isDaytime) {
      if (day.daily.high === null || temp > day.daily.high) day.daily.high = temp
      if (!day.daily.icon) {
        day.daily.icon = period.icon
        day.daily.shortForecast = period.shortForecast
      }
    } else {
      if (day.daily.low === null || temp < day.daily.low) day.daily.low = temp
    }

    if (day.daily.probabilityOfPrecipitation === null || pop > day.daily.probabilityOfPrecipitation)
      day.daily.probabilityOfPrecipitation = pop
    if (day.daily.windSpeed === null || wind > day.daily.windSpeed)
      day.daily.windSpeed = wind

    day.hourly.temperature.push({ time, timestamp, value: temp })
    day.hourly.windSpeed.push({ time, timestamp, value: wind })
    day.hourly.probabilityOfPrecipitation.push({ time, timestamp, value: pop })
    day.hourly.relativeHumidity.push({ time, timestamp, value: period.relativeHumidity?.value ?? null })
    day.hourly.dewpoint.push({ time, timestamp, value: period.dewpoint?.value != null ? convertCelsiusToFahrenheit(period.dewpoint.value) : null })
  }

  const days = Object.values(grouped)
  days.forEach((day) => {
    const dayEntries = gridQuantPrecip.filter(
      (e) => dayjs(e.time).format('YYYY-MM-DD') === day.date
    )
    day.daily.precipTotal = getDailyPrecipTotal(dayEntries)
  })

  return days
}

// TODO: TG-70: rewrite to consume hourly periods[] array instead of grid-expanded shape
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

  const dateSet = [...new Set(allTimes.map((e) => dayjs(e.time).format('YYYY-MM-DD')))].sort()

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
    const maxEntry = maxTemperature.find((e) => dayjs(e.time).format('YYYY-MM-DD') === date)
    const minEntry = minTemperature.find((e) => dayjs(e.time).format('YYYY-MM-DD') === date)
    day.daily.high = maxEntry?.value ?? null
    day.daily.low = minEntry?.value ?? null

    // derived daily summaries from hourly
    const pop = day.hourly.probabilityOfPrecipitation
    const wind = day.hourly.windSpeed

    day.daily.probabilityOfPrecipitation = pop.length ? Math.max(...pop.map((e) => e.value)) : null

    day.daily.windSpeed = wind.length ? Math.round(Math.max(...wind.map((e) => e.value))) : null
  })
  return days
}

// TODO: TG-70: delete this entire function once hourly parser replaces it
export function processNWSGridData(gridpointData) {
  const { POINT, ACCUMULATE } = PROPERTY_MODES
  const props = gridpointData.properties

  return {
    temperature: processProperty(props.temperature, convertCelsiusToFahrenheit),
    apparentTemperature: processProperty(props.apparentTemperature, convertCelsiusToFahrenheit),
    windSpeed: processProperty(props.windSpeed, convertKmhToMph),
    probabilityOfPrecipitation: processProperty(props.probabilityOfPrecipitation),
    quantitativePrecipitation: processProperty(
      props.quantitativePrecipitation,
      convertMMtoIn,
      ACCUMULATE
    ),
    maxTemperature: processProperty(props.maxTemperature, convertCelsiusToFahrenheit, POINT),
    minTemperature: processProperty(props.minTemperature, convertCelsiusToFahrenheit, POINT)
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

// export function processPrecipitationByDay(precipData) {
//   const dailyTotals = {}
//
//   precipData.forEach(({ time, value }) => {
//     const dayKey = time.format('YYYY-MM-DD')
//     if (!dailyTotals[dayKey]) {
//       dailyTotals[dayKey] = { date: time.startOf('day'), totalIn: 0 }
//     }
//     dailyTotals[dayKey].totalIn += value ?? 0
//   })
//
//   return Object.values(dailyTotals)
//     .sort((a, b) => a.date.valueOf() - b.date.valueOf())
//     .map(({ date, totalIn }) => ({
//       date,
//       label: date.format('ddd'),
//       totalIn: +totalIn.toFixed(2)
//     }))
// }

function processProperty(property, converter = (v) => v, mode = PROPERTY_MODES.HOURLY) {
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

// TODO: TG-70: add computeApparentTemperature(tempF, relativeHumidity, windSpeedMph) here
// — wind chill when tempF ≤ 50 && wind > 3 mph; heat index when tempF ≥ 80 && humidity ≥ 40%; otherwise tempF
function parseWindSpeed(str) {
  const match = str?.match(/\d+/)
  return match ? parseInt(match[0], 10) : 0
}

// TODO: TG-70: add computeApparentTemperature(tempF, relativeHumidity, windSpeedMph) here
// — wind chill when tempF ≤ 50 && wind > 3 mph; heat index when tempF ≥ 80 && humidity ≥ 40%; otherwise tempF
function convertCelsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32
}
function convertKmhToMph(kmh) {
  return kmh * 0.621371
}
function convertMMtoIn(mm) {
  return Math.round(mm * 0.0393701 * 100) / 100
}
