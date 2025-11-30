export function chartDefaultConfig(options, gradientPlugin) {
  const datasets = options.datasets || [
    {
      key: 'temperature',
      label: 'Temperature (°F)',
      borderColor: '#1976D2',
      unit: '°F',
      yAxisID: 'y'
    },
    {
      key: 'apparentTemperature',
      label: 'Feels Like',
      borderColor: '#0dbce8',
      unit: '°F',
      yAxisID: 'y'
    },
    {
      key: 'quantitativePrecipitation',
      label: 'Precip Amount',
      borderColor: '#4FC3F7',
      unit: ' in',
      yAxisID: 'y2'
    }
  ]

  return {
    type: 'line',
    data: {
      labels: [],
      datasets: datasets.map((ds) => ({
        label: ds.label,
        data: [],
        borderColor: ds.borderColor,
        backgroundColor: ds.backgroundColor,
        tension: 0.4,
        fill: false,
        unit: ds.unit,
        yAxisID: ds.yAxisID
      }))
    },
    options: {
      layout: { padding: options.padding || 0 },
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'x'
      },
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 0
          }
        },
        y: {
          type: 'linear',
          position: 'left',
          grace: '5%',
          beginAtZero: options.beginAtZero ?? false,
          title: {
            display: true,
            text: 'Temperature (°F)',
            color: '#1976D2'
          },
          ticks: {
            color: '#1976D2'
          }
        },
        y2: {
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          grid: {
            drawOnChartArea: false
          },
          title: {
            display: true,
            text: 'Precipitation (in)',
            color: '#4FC3F7'
          },
          ticks: {
            color: '#4FC3F7'
          },
          afterDataLimits: (scale) => {
            const minMax = 0.5 // At least 0.5 inches on the scale
            scale.max = Math.max(scale.max * 4, minMax)
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const unit = context.dataset.unit || ''
              return `${context.dataset.label}: ${context.parsed.y}${unit}`
            },
            labelColor: function (context) {
              if (context.dataset.label === 'Temperature (°F)') {
                return {
                  backgroundColor: '#1976D2',
                  borderColor: '#1976D2',
                  borderWidth: 2,
                  borderRadius: 2
                }
              }
              return {
                backgroundColor: '#0dbce8',
                borderColor: '#0dbce8',
                borderWidth: 2,
                borderRadius: 2
              }
            }
          }
        },
        annotation: {
          clip: false,
          annotations: {}
        }
      },
      ...options.chartOptions
    },
    plugins: gradientPlugin ? [gradientPlugin] : []
  }
}
