<template>
  <!-- hide cards using nasty v-if for now until we clear the data further upstream -->
  <v-col v-if="day.daily.high" cols="3">
    <v-card class="text-center text-medium-emphasis" border>
      <div class="text-label-small border-b mb-1">
        {{ day.label }}
      </div>
      <v-tooltip :text="day.daily.shortForecast" location="top">
        <template #activator="{ props: tooltipProps }">
          <v-icon v-bind="tooltipProps" class="my-1" size="28" :color="conditionColor">
            {{ conditionIcon }}
          </v-icon>
        </template>
      </v-tooltip>
      <div class="text-title-large">
        {{ day.daily.high }}&deg;
      </div>
      <div class="text-label-medium">
        {{ day.daily.low }}&deg;
      </div>
      <div class="text-label-small d-flex align-center justify-center mt-1">
        <v-icon size="12" class="mr-1" :color="popIconColor">
          mdi-weather-rainy
        </v-icon>
        {{ day.daily.probabilityOfPrecipitation }}%
      </div>
      <div class="text-label-small d-flex align-center justify-center mb-1">
        <v-icon size="12" class="mr-1" :color="precipIconColor">
          mdi-water-outline
        </v-icon>
        {{ precipDisplay }}
      </div>
    </v-card>
  </v-col>
</template>

<script setup>
import { computed } from 'vue'
import { getNWSConditionIcon, getNWSConditionColor } from '@/utils/weatherUtils.js'
import { PRECIP_CHANCE_THRESHOLD, PRECIP_TOTAL_THRESHOLD } from '@/config/appDefaults.js'

const props = defineProps({
  day: {
    type: Object,
    required: true
  }
})

const conditionIcon = computed(() => getNWSConditionIcon(props.day.daily.icon))
const conditionColor = computed(() => getNWSConditionColor(props.day.daily.icon, props.day.daily.high))
const popIconColor = computed(() => props.day.daily.probabilityOfPrecipitation > PRECIP_CHANCE_THRESHOLD ? 'blue-lighten-2' : 'grey')
const precipIconColor = computed(() => props.day.daily.precipTotal > PRECIP_TOTAL_THRESHOLD ? 'blue-lighten-2' : 'grey')
const precipDisplay = computed(() => props.day.daily.precipTotal > 0 ? `${props.day.daily.precipTotal}"` : '--')
</script>

<style scoped></style>
