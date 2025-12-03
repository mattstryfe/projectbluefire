<template>
  <div class="chart-wrapper">
    <div class="chart-container">
      <canvas
        ref="temperatureChartCanvas"
        :class="{ 'chart-loading': isLoadingForecast }"
      ></canvas>
      <!--      <PrecipitationOverlay :chart-instance="chartInstance" />-->
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
const temperatureChartCanvas = ref(null)

const { createChart, updateChartData } = useWeatherChart(
  temperatureChartCanvas,
  {
    label: 'Precip %',
    borderColor: '#1976D2',
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    showFreezeLine: true
  }
)

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

<style scoped></style>
