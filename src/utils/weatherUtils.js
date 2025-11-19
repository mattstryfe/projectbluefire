import dayjs from 'dayjs'

export function processNWSTemperatureData(gridpointData) {
  return gridpointData.properties.temperature.values.map((item) => {
    const { start } = parseNWSTimeInterval(item.validTime)

    return {
      time: start.format('MMM DD ha'), // "Nov 19 2pm"
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

  // Parse start time with dayjs
  const start = dayjs(startTime)

  // Parse ISO 8601 duration manually
  const days = durationStr.match(/(\d+)D/)
  const hours = durationStr.match(/(\d+)H/)
  const minutes = durationStr.match(/(\d+)M/)

  let totalHours = 0
  if (days) totalHours += parseInt(days[1]) * 24
  if (hours) totalHours += parseInt(hours[1])
  if (minutes) totalHours += parseInt(minutes[1]) / 60

  // Add duration to start time
  const end = start.add(totalHours, 'hour')

  return {
    start,
    end,
    durationHours: totalHours
  }
}
