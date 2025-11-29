// Gradient presets
const gradientPresets = {
  none: null,
  icyToDark: {
    cold: ['#29B6F6', '#1976D2', '#0D47A1'],
    warm: ['#FFA726', '#EF5350']
  },
  darkToIcy: {
    cold: ['#0D47A1', '#1976D2', '#29B6F6'],
    warm: ['#FFA726', '#EF5350']
  }
}

export function createTemperatureGradient(chart, mode = 'icyToDark') {
  if (mode === 'none' || !gradientPresets[mode]) return null

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

  const freezeRatio = (32 - min) / (max - min)
  const clampedRatio = Math.max(0, Math.min(1, freezeRatio))

  const { cold, warm } = gradientPresets[mode]

  gradient.addColorStop(0, cold[0])
  gradient.addColorStop(clampedRatio * 0.5, cold[1])
  gradient.addColorStop(clampedRatio, cold[2])
  gradient.addColorStop(Math.min(1, clampedRatio + 0.01), warm[0])
  gradient.addColorStop(1, warm[1])

  return gradient
}

export function createGradientPlugin(getOptions) {
  return {
    id: 'temperatureGradient',
    afterLayout(chart) {
      const { gradientMode } = getOptions()
      const gradient = createTemperatureGradient(chart, gradientMode)

      chart.data.datasets.forEach((dataset, index) => {
        if (dataset.yAxisID === 'y' && dataset.unit === '°F') {
          dataset.borderColor =
            gradient || (index === 0 ? '#1976D2' : '#0dbce8')
        }
      })
    }
  }
}

export function createFreezeLineAnnotation(options = {}) {
  return {
    type: 'line',
    yMin: 32,
    yMax: 32,
    borderColor: options.color || 'rgba(24, 138, 243, 0.5)',
    borderWidth: options.width || 1
  }
}
