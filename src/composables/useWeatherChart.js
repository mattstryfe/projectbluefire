import { reactive, onBeforeUnmount, shallowRef } from 'vue'
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { findDayBoundaries } from '@/utils/weatherUtils.js'
import {
  precipitationChartConfig,
  temperatureChartConfig
} from '@/utils/weatherChartConfig.js'
import {
  createGradientPlugin,
  createFreezeLineAnnotation
} from '@/utils/weatherChartPlugins.js'

Chart.register(...registerables, annotationPlugin)

const GRADIENT_MODES = ['icyToDark', 'darkToIcy', 'none']

export function useWeatherChart(canvasRef, initialOptions = {}) {
  const chartInstance = shallowRef(null)

  // Dataset styling defined at init, data passed separately
  const datasetStyles = initialOptions.datasets || [
    {
      label: 'Data',
      borderColor: '#ff6384',
      backgroundColor: 'rgba(255, 99, 132, 0.1)'
    }
  ]

  // Reactive toggle state
  const toggles = reactive({
    showFreezeLine: initialOptions.showFreezeLine ?? false,
    gradientMode: initialOptions.gradientMode ?? 'none'
  })

  const gradientPlugin = createGradientPlugin(() => toggles)

  // Pick config based on chartType
  const defaultConfig =
    initialOptions.chartType === 'precipitation'
      ? precipitationChartConfig(initialOptions)
      : temperatureChartConfig(initialOptions, gradientPlugin)

  // Initialize datasets in the chart config from styles
  defaultConfig.data.datasets = datasetStyles.map((style) => ({
    label: style.label,
    data: [],
    borderColor: style.borderColor,
    backgroundColor: style.backgroundColor ?? 'transparent',
    borderWidth: style.borderWidth ?? 2,
    fill: style.fill ?? false,
    tension: style.tension ?? 0.4,
    pointRadius: style.pointRadius ?? 0,
    yAxisID: style.yAxisID ?? 'y',
    ...style.chartOptions
  }))

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
        yAdjust: 25,
        yValue: (ctx) => ctx.chart.scales.y.max + 2,
        content: boundary.label,
        color: initialOptions.labelColor || '#999',
        font: { size: initialOptions.labelSize || 12 }
      }
    })

    return annotations
  }

  function buildAnnotations(boundaryData) {
    const annotations = createDayAnnotations(boundaryData)

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
    chartInstance.value = new Chart(canvasRef.value, defaultConfig)
    return chartInstance.value
  }

  function refreshChart() {
    if (!chartInstance.value) return
    const boundaryData = chartInstance.value._boundaryData || []
    if (boundaryData.length) {
      chartInstance.value.options.plugins.annotation.annotations =
        buildAnnotations(boundaryData)
    }
    chartInstance.value.update()
  }

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
    if (chartInstance.value) {
      chartInstance.value.destroy()
      chartInstance.value = null
    }
  }

  function updateChartData(dataArrays, boundaryData = null) {
    if (!chartInstance.value || !dataArrays?.length) return

    const boundary = boundaryData || dataArrays[0]
    if (!boundary?.length) return

    chartInstance.value._boundaryData = boundary
    chartInstance.value.data.labels = boundary.map(() => '')

    dataArrays.forEach((dataArray, index) => {
      if (chartInstance.value.data.datasets[index] && dataArray) {
        chartInstance.value.data.datasets[index].data = dataArray.map(
          (item) => item.value
        )
      }
    })

    chartInstance.value.options.plugins.annotation.annotations =
      buildAnnotations(boundary)
    chartInstance.value.update()
  }

  onBeforeUnmount(() => destroyChart())

  return {
    createChart,
    updateChartData,
    destroyChart,
    chartInstance,
    toggles,
    toggle,
    cycleGradientMode
  }
}
