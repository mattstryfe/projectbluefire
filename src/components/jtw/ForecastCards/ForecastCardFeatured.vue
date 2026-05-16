<template>
  <v-col cols="6">
    <v-card class="text-center" border>
      <div class="text-label-small border-b mb-1">
        Now
      </div>

      <v-card-item>
        <v-tooltip :text="day.daily.shortForecast" location="top">
          <template #activator="{ props: tooltipProps }">
            <v-icon v-bind="tooltipProps" size="48" class="mb-1">
              {{ conditionIcon }}
            </v-icon>
          </template>
        </v-tooltip>
        <v-card-title class="text-display-large ms-2">
          {{ currentTemperature }}&deg;
        </v-card-title>
        <v-card-subtitle v-if="currentApparentTemperature !== null">
          feels like {{ currentApparentTemperature }}&deg;
        </v-card-subtitle>
        <v-card-subtitle>
          high: {{ day.daily.high }}&deg; / low: {{ day.daily.low }}&deg;
        </v-card-subtitle>
        <v-card-subtitle class="d-flex align-center justify-center gap-1">
          <v-tooltip text="Chance of precipitation" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-icon v-bind="tooltipProps" size="14">
                mdi-weather-rainy
              </v-icon>
            </template>
          </v-tooltip>
          {{ day.daily.probabilityOfPrecipitation }}%
        </v-card-subtitle>
        <v-card-subtitle class="d-flex align-center justify-center gap-1">
          <v-tooltip text="Expected precipitation total" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-icon v-bind="tooltipProps" size="14">
                mdi-water-outline
              </v-icon>
            </template>
          </v-tooltip>
          {{ day.daily.precipTotal > 0 ? `${day.daily.precipTotal}"` : '--' }}
        </v-card-subtitle>
      </v-card-item>
    </v-card>
  </v-col>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import { getNWSConditionIcon } from '@/utils/weatherUtils.js'

const props = defineProps({
  day: {
    type: Object,
    required: true
  }
})

// Returns the most recent hourly value that has already started
function getCurrentValue(entries) {
  if (!entries?.length) return null
  const now = dayjs()
  return entries.findLast((entry) => !dayjs(entry.timestamp).isAfter(now))?.value ?? null
}

const currentTemperature = computed(() => getCurrentValue(props.day.hourly.temperature))
// TODO: TG-70: wire to computeApparentTemperature once added in TG-70
const currentApparentTemperature = computed(() =>
  getCurrentValue(props.day.hourly.apparentTemperature)
)
const conditionIcon = computed(() => getNWSConditionIcon(props.day.daily.icon))
</script>

<style scoped></style>
