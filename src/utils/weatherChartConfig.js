export const defaultChartConfig = {
  datasets: [{ label: 'Data', borderColor: '#ff6384' }],
  showFreezeLine: false,
  gradientMode: 'none',
  chart: {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false, axis: 'x' },
      scales: {
        x: { ticks: { autoSkip: false, maxRotation: 0 } },
        y: { type: 'linear', position: 'left' }
      },
      plugins: {
        legend: { display: false },
        annotation: { clip: false, annotations: {} }
      }
    },
    plugins: []
  }
}

export const temperatureChartConfig = {
  datasets: [
    { label: 'Temperature', borderColor: '#ff6384', unit: '°F' },
    { label: 'Feels Like', borderColor: '#36a2eb', unit: '°F' }
  ],
  showFreezeLine: true,
  gradientMode: 'icyToDark',
  chart: {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
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
    plugins: []
  }
}

export const precipitationChartConfig = {
  datasets: [
    {
      label: 'Chance of Rain',
      borderColor: '#1976D2',
      backgroundColor: 'rgba(25, 118, 210, 0.2)',
      fill: true,
      unit: '%'
    }
  ],
  showFreezeLine: false,
  gradientMode: 'none',
  chart: {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
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
