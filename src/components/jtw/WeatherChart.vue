<template>
  <div class="chart-wrapper">
    <WeatherChartControls
      :toggles="toggles"
      @toggle="toggle"
      @cycle-gradient="cycleGradientMode"
    />
    <div class="chart-container mt-5">
      <canvas
        ref="weatherChartCanvas"
        :class="{ 'chart-loading': isLoadingForecast }"
      ></canvas>
      <PrecipitationOverlay :chart-instance="chartInstance" />
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
const weatherChartCanvas = ref(null)

const {
  createChart,
  updateChartData,
  toggles,
  toggle,
  cycleGradientMode,
  chartInstance
} = useWeatherChart(weatherChartCanvas, {
  label: 'Temperature (°F)',
  borderColor: '#1976D2',
  backgroundColor: 'rgba(25, 118, 210, 0.1)',
  showFreezeLine: true
})

onMounted(() => {
  createChart()
  if (forecastData.value.raw) {
    updateChartData(forecastData.value.raw)
  }
})

watch(
  forecastData,
  (newData) => {
    updateChartData(newData.raw)
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
