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
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'
import { computed, onMounted, ref, watch } from 'vue'
import { useWeatherChart } from '@/composables/useWeatherChart.js'

const { forecastData, isLoadingForecast } = storeToRefs(useWeatherDataStore())
const precipData = computed(() => forecastData.value.parsed.precipitation)
const precipitationChartCanvas = ref(null)

const { createChart, updateChartData } = useWeatherChart(
  precipitationChartCanvas,
  {
    datasets: [
      {
        label: 'Precip %',
        borderColor: '#1976D2',
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        fill: true
      }
    ]
  }
)

onMounted(() => {
  createChart()
  if (forecastData.value.raw) {
    updateChartData(precipData.value)
  }
})

watch(
  forecastData,
  (newData) => {
    updateChartData(newData.parsed.precipitation)
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
