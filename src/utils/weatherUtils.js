import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export function processNWSTemperatureData(gridpointData) {
  return gridpointData.properties.temperature.values.map((item) => {
    const { start } = parseNWSTimeInterval(item.validTime)

    return {
      time: start,
      timestamp: start.valueOf(), // For sorting if needed
      temperature: convertCelsiusToFahrenheit(item.value)
    }
  })
}

function convertCelsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32
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
