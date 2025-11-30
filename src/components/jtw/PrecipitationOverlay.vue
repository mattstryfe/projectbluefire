<template>
  <div class="precip-overlay">
    <div
      v-for="day in precipContainers"
      :key="day.x"
      class="precip-bar-container"
      :style="{ left: `${day.x}px` }"
    >
      <span class="precip-amount">{{ day.totalInches }}"</span>
      <div class="precip-bar">
        <div class="precip-fill" :style="{ height: `${day.fillPercent}%` }" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'

const props = defineProps({
  chartInstance: { type: Object, default: null }
})
const { forecastData } = storeToRefs(useWeatherDataStore())
const precipData = computed(() => forecastData.value.parsed.precipitation)
const precipContainers = ref([])

// Calculate max from actual data so bars scale relative to each other
const maxPrecipInches = computed(() => {
  if (!precipData.value?.length) return 1
  const max = Math.max(...precipData.value.map((d) => d.totalInches))
  // Return at least 0.1 to avoid division issues on dry days
  return Math.max(max, 0.1)
})

function calculatePositions() {
  if (!props.chartInstance) return

  const chart = props.chartInstance
  const annotations = chart.options.plugins.annotation.annotations
  const precip = precipData.value || []

  // Get all day label annotations from the chart, sorted by xValue
  const dayLabels = Object.keys(annotations)
    .filter((key) => key.startsWith('label-'))
    .map((key) => ({
      label: annotations[key].content,
      xValue: annotations[key].xValue
    }))
    .sort((a, b) => a.xValue - b.xValue)

  precipContainers.value = dayLabels.map((day, index) => {
    // Match by index position, not label name
    const dayPrecip = precip[index]

    return {
      label: day.label,
      x: chart.scales.x.getPixelForValue(day.xValue),
      totalMm: dayPrecip?.totalMm ?? 0,
      totalInches: dayPrecip?.totalInches ?? 0,
      fillPercent: dayPrecip
        ? (dayPrecip.totalInches / maxPrecipInches.value) * 100
        : 0
    }
  })
}

watch(
  () => precipData.value,
  () => {
    calculatePositions()
  }
)
</script>

<style scoped>
.precip-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.precip-bar-container {
  position: absolute;
  bottom: 40px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.precip-amount {
  font-size: 10px;
  color: #4fc3f7;
  margin-bottom: 2px;
}

.precip-bar {
  width: 20px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.precip-fill {
  width: 100%;
  background: linear-gradient(to top, #1976d2, #4fc3f7);
  border-radius: 0 0 3px 3px;
}
</style>
