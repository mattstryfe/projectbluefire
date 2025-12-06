<template>
  <div class="chart-wrapper">
    <div class="chart-container">
      <canvas
        ref="precipitationChartCanvas"
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
import { precipitationChartConfig } from '@/utils/weatherChartConfig.js'

const { forecastData, isLoadingForecast } = storeToRefs(useWeatherDataStore())
const precipitationChartCanvas = ref(null)

const { createChart, updateChartData } = useWeatherChart(
  precipitationChartCanvas,
  precipitationChartConfig
)

onMounted(() => {
  createChart()
  if (forecastData.value.raw?.probabilityOfPrecipitation) {
    updateChartData(
      [forecastData.value.raw.probabilityOfPrecipitation],
      forecastData.value.raw.temperature
    )
  }
})

watch(
  forecastData,
  (newData) => {
    if (newData.raw?.probabilityOfPrecipitation) {
      updateChartData(
        [newData.raw.probabilityOfPrecipitation],
        newData.raw.temperature
      )
    }
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
