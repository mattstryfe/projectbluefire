import { reactive, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { findDayBoundaries } from '@/utils/weatherUtils.js'
import { chartDefaultConfig } from '@/utils/weatherChartConfig.js'
import {
  createGradientPlugin,
  createFreezeLineAnnotation
} from '@/utils/weatherChartPlugins.js'

Chart.register(...registerables, annotationPlugin)

const GRADIENT_MODES = ['icyToDark', 'darkToIcy', 'none']

export function useWeatherChart(canvasRef, initialOptions = {}) {
  let chartInstance = null

  // Reactive toggle state
  const toggles = reactive({
    showFreezeLine: initialOptions.showFreezeLine ?? true,
    gradientMode: initialOptions.gradientMode ?? 'icyToDark'
  })
  const gradientPlugin = createGradientPlugin(() => toggles)
  const defaultConfig = chartDefaultConfig(initialOptions, gradientPlugin)

  function createDayAnnotations(data) {
    const boundaries = findDayBoundaries(data)
    const annotations = {}

    boundaries.forEach((boundary, i) => {
      const nextIndex = boundaries[i + 1]?.index ?? data.length

      annotations[`line-${i}`] = {
        type: 'line',
        xMin: boundary.index,
        xMax: boundary.index,
        borderColor: initialOptions.dayLineColor || 'rgba(255, 255, 255, 0.3)',
        borderWidth: initialOptions.dayLineWidth || 1,
        borderDash: initialOptions.dayLineDash || [5, 5]
      }

      annotations[`label-${i}`] = {
        type: 'label',
        xValue: (boundary.index + nextIndex) / 2,
        yValue: (ctx) => ctx.chart.scales.y.min - 2,
        content: boundary.label,
        color: initialOptions.labelColor || '#999',
        font: { size: initialOptions.labelSize || 12 }
      }
    })

    return annotations
  }

  function buildAnnotations(data) {
    const annotations = createDayAnnotations(data)

    if (toggles.showFreezeLine) {
      annotations.freezeLine = createFreezeLineAnnotation({
        color: initialOptions.freezeLineColor,
        width: initialOptions.freezeLineWidth
      })
    }

    return annotations
  }

  function createChart() {
    if (!canvasRef.value) return
    chartInstance = new Chart(canvasRef.value, defaultConfig)
    return chartInstance
  }

  function refreshChart() {
    if (!chartInstance) return
    // Rebuild annotations with current toggle state
    const tempData = chartInstance.data.datasets[0].data
    if (tempData.length) {
      // Need original data for day boundaries - store reference
      chartInstance.options.plugins.annotation.annotations = buildAnnotations(
        chartInstance._tempData || []
      )
    }
    chartInstance.update()
  }

  // Toggle helpers
  function toggle(key) {
    if (key in toggles) {
      if (typeof toggles[key] === 'boolean') {
        toggles[key] = !toggles[key]
      }
      refreshChart()
    }
  }

  function cycleGradientMode() {
    const currentIndex = GRADIENT_MODES.indexOf(toggles.gradientMode)
    const nextIndex = (currentIndex + 1) % GRADIENT_MODES.length
    toggles.gradientMode = GRADIENT_MODES[nextIndex]
    refreshChart()
  }

  function destroyChart() {
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
  }

  // Store temp data reference for rebuilding annotations
  function updateChartDataWithRef(data) {
    if (!chartInstance || !data?.temperature?.length) return

    const tempData = data.temperature
    // TODO: look into this later...
    chartInstance._tempData = tempData // Store for refreshChart

    chartInstance.data.labels = tempData.map(() => '')
    chartInstance.data.datasets[0].data = data.temperature.map(
      (item) => item.value
    )
    chartInstance.data.datasets[1].data = data.apparentTemperature.map(
      (item) => item.value
    )
    chartInstance.data.datasets[2].data = data.quantitativePrecipitation.map(
      (item) => item.value
    )
    chartInstance.options.plugins.annotation.annotations =
      buildAnnotations(tempData)
    chartInstance.update()
  }

  onBeforeUnmount(() => destroyChart())

  return {
    createChart,
    updateChartData: updateChartDataWithRef,
    destroyChart,
    getChartInstance: () => chartInstance,
    toggles,
    toggle,
    cycleGradientMode
  }
}
