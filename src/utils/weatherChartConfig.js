export function chartDefaultConfig(options) {
  const datasets = options.datasets || [
    {
      key: 'temperature',
      label: 'Temperature (°F)',
      borderColor: '#1976D2',
      // backgroundColor: 'rgba(25, 118, 210, 0.1)',
      unit: '°F',
      yAxisID: 'y'
    },
    // {
    //   key: 'humidity',
    //   label: 'Humidity',
    //   borderColor: '#bc03d1',
    //   backgroundColor: 'rgba(188, 3, 209, 0.1)',
    //   unit: '%',
    //   yAxisID: 'y1'
    // },
    {
      key: 'feels like',
      label: 'Feels Like',
      borderColor: '#0dbce8',
      // backgroundColor: 'rgba(188, 3, 209, 0.1)',
      unit: '°F',
      yAxisID: 'y'
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
        fill: true,
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
        }
        // y1: {
        //   type: 'linear',
        //   position: 'right',
        //   min: 0,
        //   max: 100,
        //   grid: {
        //     drawOnChartArea: false // Prevents grid lines from overlapping
        //   },
        //   title: {
        //     display: true,
        //     text: 'Humidity (%)',
        //     color: '#bc03d1'
        //   },
        //   ticks: {
        //     color: '#bc03d1'
        //   }
        // }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const unit = context.dataset.unit || ''
              return `${context.dataset.label}: ${context.parsed.y}${unit}`
            },
            labelColor: function (context) {
              return {
                backgroundColor: context.dataset.borderColor,
                borderColor: context.dataset.borderColor,
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
    }
  }
}
