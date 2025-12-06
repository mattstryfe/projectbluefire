export function temperatureChartConfig(options, gradientPlugin) {
  return {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      layout: { padding: options.padding || 0 },
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false, axis: 'x' },
      scales: {
        x: { ticks: { autoSkip: false, maxRotation: 0 } },
        y: {
          type: 'linear',
          position: 'left',
          grace: '5%',
          title: { display: true, text: 'Temperature (°F)', color: '#1976D2' },
          ticks: { color: '#1976D2' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `${ctx.dataset.label}: ${ctx.parsed.y}${ctx.dataset.unit || ''}`,
            labelColor: (ctx) => ({
              backgroundColor: ctx.dataset.borderColor,
              borderColor: ctx.dataset.borderColor,
              borderWidth: 2,
              borderRadius: 2
            })
          }
        },
        annotation: { clip: false, annotations: {} }
      }
    },
    plugins: gradientPlugin ? [gradientPlugin] : []
  }
}

export function precipitationChartConfig(options) {
  return {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      layout: { padding: options.padding || 0 },
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false, axis: 'x' },
      scales: {
        x: { ticks: { autoSkip: false, maxRotation: 0 } },
        y: {
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Chance of Precipitation (%)',
            color: '#1976D2'
          },
          ticks: {
            color: '#1976D2',
            callback: (value) => `${value}%`
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
            labelColor: (ctx) => ({
              backgroundColor: ctx.dataset.borderColor,
              borderColor: ctx.dataset.borderColor,
              borderWidth: 2,
              borderRadius: 2
            })
          }
        },
        annotation: { clip: false, annotations: {} }
      }
    },
    plugins: []
  }
}
