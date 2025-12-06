<template>
  <div class="chart-wrapper">
    <WeatherChartControls
      :toggles="toggles"
      @toggle="toggle"
      @cycle-gradient="cycleGradientMode"
    />
    <div class="chart-container mt-5">
      <canvas
        ref="temperatureChartCanvas"
        :class="{ 'chart-loading': isLoadingForecast }"
      ></canvas>
      <v-overlay
        :model-value="isLoadingForecast"
        contained
        class="align-center justify-center"
        persistent
        :scrim="false"
      >
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-overlay>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'
import { useWeatherChart } from '@/composables/useWeatherChart.js'
import WeatherChartControls from '@/components/jtw/WeatherChartControls.vue'
import PrecipitationOverlay from '@/components/jtw/PrecipitationOverlay.vue'

const { forecastData, isLoadingForecast } = storeToRefs(useWeatherDataStore())
const temperatureChartCanvas = ref(null)

const { createChart, updateChartData, toggles, toggle, cycleGradientMode } =
  useWeatherChart(temperatureChartCanvas, {
    chartType: 'temperature',
    datasets: [
      { label: 'Temperature', borderColor: '#ff6384' },
      { label: 'Feels Like', borderColor: '#36a2eb' }
    ],
    showFreezeLine: true,
    gradientMode: 'icyToDark'
  })

onMounted(() => {
  createChart()
  if (forecastData.value.raw) {
    updateChartData([
      forecastData.value.raw.temperature,
      forecastData.value.raw.apparentTemperature
    ])
  }
})

watch(
  forecastData,
  (newData) => {
    console.log('tempData', newData)
    updateChartData([newData.raw.temperature, newData.raw.apparentTemperature])
  },
  { deep: true }
)
</script>

<style scoped>
.chart-loading {
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.chart-wrapper {
  overflow-x: auto;
  width: 100%;
}

.chart-container {
  position: relative; /* Required for contained overlay */
  min-height: 40vh;
  width: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    width: 700px;
  }
}
</style>
