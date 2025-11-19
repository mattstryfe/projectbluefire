import { ref, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export function useWeatherChart(canvasRef, options = {}) {
  let chartInstance = null

  const defaultConfig = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: options.label || 'Temperature (°F)',
          data: [],
          borderColor: options.borderColor || '#1976D2',
          backgroundColor: options.backgroundColor || 'rgba(25, 118, 210, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: options.beginAtZero ?? false
        }
      },
      ...options.chartOptions
    }
  }

  function createChart() {
    if (!canvasRef.value) return
    chartInstance = new Chart(canvasRef.value, defaultConfig)
    return chartInstance
  }

  function updateChartData(newData) {
    if (!chartInstance || !newData || !Array.isArray(newData)) return

    chartInstance.data.labels = newData.map((item) => item.time)
    chartInstance.data.datasets[0].data = newData.map(
      (item) => item.temperature
    )
    chartInstance.update('none')
  }

  function destroyChart() {
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
  }

  // Auto cleanup
  onBeforeUnmount(() => {
    destroyChart()
  })

  return {
    createChart,
    updateChartData,
    destroyChart,
    getChartInstance: () => chartInstance
  }
}
