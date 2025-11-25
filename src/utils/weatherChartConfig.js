export function chartDefaultConfig(options) {
  return {
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
      layout: { padding: options.padding || 0 },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            autoSkip: false, // Add this - prevents Chart.js from skipping labels
            maxRotation: 0
          }
        },
        y: {
          grace: '5%',
          beginAtZero: options.beginAtZero ?? false
        }
      },
      plugins: {
        annotation: {
          clip: false,
          annotations: {} // Initialize empty
        }
      },
      ...options.chartOptions
    }
  }
}
