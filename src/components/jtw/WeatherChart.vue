<template>
  <div class="chart-container">
    <canvas ref="weatherChartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'
import { useWeatherChart } from '@/composables/useWeatherChart.js'

const { temperatureData } = storeToRefs(useWeatherDataStore())
const weatherChartCanvas = ref(null)

// Initialize chart composable
const { createChart, updateChartData } = useWeatherChart(weatherChartCanvas, {
  label: 'Temperature (°F)',
  borderColor: '#1976D2',
  backgroundColor: 'rgba(25, 118, 210, 0.1)'
})

onMounted(() => {
  createChart()
})

watch(
  temperatureData,
  (newData) => {
    updateChartData(newData)
  },
  { deep: true }
)
</script>

<style scoped>
.chart-container {
  position: relative;
  min-height: 40vh; /* or use height: 40vh for viewport-based sizing */
  width: 100%;
}
</style>
