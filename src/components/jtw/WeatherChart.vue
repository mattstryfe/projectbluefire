<template>
  <div class="chart-wrapper">
    <div class="chart-container">
      <canvas ref="weatherChartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'
import { useWeatherChart } from '@/composables/useWeatherChart.js'

const { temperatureData } = storeToRefs(useWeatherDataStore())
const weatherChartCanvas = ref(null)

const { createChart, updateChartData } = useWeatherChart(weatherChartCanvas, {
  label: 'Temperature (°F)',
  borderColor: '#1976D2',
  backgroundColor: 'rgba(25, 118, 210, 0.1)',
  showFreezeLine: true
})

onMounted(() => {
  createChart()
  if (temperatureData.value) {
    updateChartData(temperatureData.value)
  }
})

watch(temperatureData, (newData) => {
  updateChartData(newData)
})
</script>

<style scoped>
.chart-wrapper {
  overflow-x: auto;
  width: 100%;
}

.chart-container {
  min-height: 40vh;
  width: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    width: 700px;
  }
}
</style>
