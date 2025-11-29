import { onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { findDayBoundaries } from '@/utils/weatherUtils.js'
import { chartDefaultConfig } from '@/utils/weatherChartConfig.js'

Chart.register(...registerables, annotationPlugin)

export function useWeatherChart(canvasRef, options = {}) {
  let chartInstance = null
  const defaultConfig = chartDefaultConfig(options)

  function createDayAnnotations(data) {
    const boundaries = findDayBoundaries(data)
    const annotations = {}

    // Freeze line
    if (options.showFreezeLine) {
      annotations.freezeLine = {
        type: 'line',
        yMin: 32,
        yMax: 32,
        borderColor: options.freezeLineColor || 'rgba(24,138,243,0.5)',
        borderWidth: options.freezeLineWidth || 1
      }
    }

    boundaries.forEach((boundary, i) => {
      // Vertical line
      annotations[`line-${i}`] = {
        type: 'line',
        xMin: boundary.index,
        xMax: boundary.index,
        borderColor: options.dayLineColor || 'rgba(255, 255, 255, 0.3)',
        borderWidth: options.dayLineWidth || 1,
        borderDash: options.dayLineDash || [5, 5]
      }

      // Centered label
      const nextIndex = boundaries[i + 1]?.index ?? data.length
      annotations[`label-${i}`] = {
        type: 'label',
        xValue: (boundary.index + nextIndex) / 2,
        yValue: (ctx) => ctx.chart.scales.y.min - 2,
        content: boundary.label,
        color: options.labelColor || '#999',
        font: { size: options.labelSize || 12 }
      }
    })

    return annotations
  }

  function createChart() {
    if (!canvasRef.value) return
    chartInstance = new Chart(canvasRef.value, defaultConfig)
    return chartInstance
  }

  function updateChartData(data) {
    console.log('data', data)
    if (!chartInstance || !data?.temperature?.length) return
    console.log('mapping')
    chartInstance.data.labels = data.temperature.map(() => '')
    chartInstance.data.datasets[0].data = data.temperature.map((d) => d.value)
    // chartInstance.data.datasets[1].data = data.humidity.map((d) => d.value)
    chartInstance.data.datasets[1].data = data.apparentTemperature.map(
      (d) => d.value
    )

    chartInstance.options.plugins.annotation.annotations = createDayAnnotations(
      data.temperature
    )
    chartInstance.update()
  }

  function destroyChart() {
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
  }

  onBeforeUnmount(() => destroyChart())

  return {
    createChart,
    updateChartData,
    destroyChart,
    getChartInstance: () => chartInstance
  }
}
