import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export function processNWSGridData(gridpointData) {
  const props = gridpointData.properties
  console.log('props', props)

  return {
    temperature: processProperty(props.temperature, convertCelsiusToFahrenheit),
    // humidity: processProperty(props.relativeHumidity),
    windSpeed: processProperty(props.windSpeed, convertKmhToMph),
    apparentTemperature: processProperty(
      props.apparentTemperature,
      convertCelsiusToFahrenheit
    )
    // Add more as needed
  }
}
function processProperty(property, converter = (v) => v) {
  if (!property?.values) return []

  const expanded = []

  property.values.forEach((item) => {
    const { start, durationHours } = parseNWSTimeInterval(item.validTime)
    const value = item.value !== null ? converter(item.value) : null

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

export function createTemperatureGradient(chart) {
  const { ctx, chartArea, scales } = chart
  if (!chartArea) return null

  const gradient = ctx.createLinearGradient(
    0,
    chartArea.bottom,
    0,
    chartArea.top
  )

  const yScale = scales.y
  const min = yScale.min
  const max = yScale.max

  // Calculate where 32 falls as a ratio (0 = bottom, 1 = top)
  const freezeRatio = (32 - min) / (max - min)
  const clampedRatio = Math.max(0, Math.min(1, freezeRatio))

  // Cold to warm gradient
  gradient.addColorStop(0, '#0D47A1') // Bottom (coldest) - dark blue
  gradient.addColorStop(clampedRatio * 0.5, '#1976D2') // Midpoint cold - medium blue
  gradient.addColorStop(clampedRatio, '#29B6F6') // At 32°F - light blue
  gradient.addColorStop(Math.min(1, clampedRatio + 0.01), '#FFA726') // Just above 32°F - orange
  gradient.addColorStop(1, '#EF5350') // Top (warmest) - red

  return gradient
}

function convertKmhToMph(kmh) {
  return kmh * 0.621371
}
function convertCelsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32
}
