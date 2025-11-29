import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export function processNWSGridData(gridpointData) {
  const props = gridpointData.properties

  return {
    temperature: processProperty(props.temperature, convertCelsiusToFahrenheit),
    // humidity: processProperty(props.relativeHumidity),
    windSpeed: processProperty(props.windSpeed, convertKmhToMph),
    apparentTemperature: processProperty(
      props.apparentTemperature,
      convertCelsiusToFahrenheit
    ),
    quantitativePrecipitation: processProperty(
      props.quantitativePrecipitation,
      convertMMtoIn
    )
    // Add more as needed
  }
}

function processProperty(property, converter = (v) => v) {
  if (!property?.values) return []

  const expanded = []

  property.values.forEach((item) => {
    const { start, durationHours } = parseNWSTimeInterval(item.validTime)
    let value = item.value !== null ? converter(item.value) : null

    // Create an entry for each hour in the interval
    for (let i = 0; i < durationHours; i++) {
      const time = start.add(i, 'hour')
      expanded.push({
        time,
        timestamp: time.valueOf(),
        value
      })
    }
  })

  return expanded
}

function parseNWSTimeInterval(validTime) {
  const [startTime, durationStr] = validTime.split('/')
  const start = dayjs(startTime)
  const totalHours = dayjs.duration(durationStr).asHours()
  const end = start.add(totalHours, 'hour')

  return { start, end, durationHours: totalHours }
}

/**
 * Find indices where day changes
 */
export function findDayBoundaries(data) {
  const boundaries = []
  let currentDay = null

  data.forEach((item, index) => {
    const day = dayjs(item.time).format('YYYY-MM-DD')
    if (day !== currentDay) {
      boundaries.push({
        index,
        label: dayjs(item.time).format('ddd')
      })
      currentDay = day
    }
  })

  return boundaries
}

function convertKmhToMph(kmh) {
  return kmh * 0.621371
}

function convertCelsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32
}

function convertMMtoIn(mm) {
  return Math.round(mm * 0.0393701 * 100) / 100
}
