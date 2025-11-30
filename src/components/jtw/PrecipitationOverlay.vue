<template>
  <div class="precip-overlay">
    <div
      v-for="day in positions"
      :key="day.label"
      class="precip-bar-container"
      :style="{ left: `${day.x}px` }"
    >
      <span class="precip-chance">{{ day.chance }}%</span>
      <div class="precip-bar">
        <div
          v-for="segment in day.segments"
          :key="segment.type"
          class="precip-segment"
          :style="{
            height: `${segment.percent}%`,
            backgroundColor: segment.color
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'
import { findDayBoundaries } from '@/utils/weatherUtils.js'

const props = defineProps({
  chartInstance: { type: Object, default: null }
})

const { forecastData } = storeToRefs(useWeatherDataStore())
const temperatureData = computed(() => forecastData.value.temperature)
const precipData = computed(() => forecastData.value.quantitativePrecipitation)

const dayBoundaries = computed(() => {
  if (!temperatureData.value) return []
  return findDayBoundaries(temperatureData.value)
})

const positions = ref([])
let resizeObserver = null

function calculatePositions() {
  if (!props.chartInstance || !dayBoundaries.value.length) return

  const chart = props.chartInstance
  console.log('dayBoundaries', dayBoundaries.value)
  positions.value = dayBoundaries.value.map((boundary, i) => {
    const nextIndex =
      dayBoundaries.value[i + 1]?.index ?? chart.data.labels.length
    const centerIndex = (boundary.index + nextIndex) / 2

    console.log('boundary.date', boundary.date)
    const dayPrecip =
      precipData.value.find((p) => p.date === boundary.date) || {}

    console.log('dayPrecip', precipData.value)
    return {
      label: boundary.label,
      x: chart.scales.x.getPixelForValue(centerIndex),
      chance: dayPrecip.chance ?? 0,
      segments: dayPrecip.segments ?? []
    }
  })
  console.log('positions', positions)
}

/*onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    nextTick(calculatePositions)
  })

  if (props.chartInstance?.canvas?.parentElement) {
    resizeObserver.observe(props.chartInstance.canvas.parentElement)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

watch(
  () => props.chartInstance,
  (chart) => {
    if (chart?.canvas?.parentElement) {
      resizeObserver?.observe(chart.canvas.parentElement)
    }
    calculatePositions()
  }
)

watch(() => dayBoundaries.value, calculatePositions, { deep: true })
watch(() => precipData.value, calculatePositions, { deep: true })*/
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
  pointer-events: auto;
}

.precip-chance {
  font-size: 10px;
  color: #999;
  margin-bottom: 2px;
}

.precip-bar {
  width: 20px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;
}

.precip-segment {
  width: 100%;
  transition: height 0.3s ease;
}
</style>
