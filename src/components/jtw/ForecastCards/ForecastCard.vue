<template>
  <!-- hide cards using nasty v-if for now until we clear the data further upstream -->
  <v-col v-if="day.daily.high" cols="3">
    <v-card class="text-center text-medium-emphasis" border>
      <div class="text-label-small border-b mb-1">
        {{ day.label }}
      </div>
      <v-tooltip :text="day.daily.shortForecast" location="top">
        <template #activator="{ props: tooltipProps }">
          <v-icon v-bind="tooltipProps" class="my-1" size="28">
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
        <v-icon size="12" class="mr-1">
          mdi-weather-rainy
        </v-icon>
        {{ day.daily.probabilityOfPrecipitation }}%
      </div>
      <div class="text-label-small d-flex align-center justify-center mb-1">
        <v-icon size="12" class="mr-1">
          mdi-water-outline
        </v-icon>
        {{ day.daily.precipTotal > 0 ? `${day.daily.precipTotal}"` : '--' }}
      </div>
    </v-card>
  </v-col>
</template>

<script setup>
import { computed } from 'vue'
import { getNWSConditionIcon } from '@/utils/weatherUtils.js'

const props = defineProps({
  day: {
    type: Object,
    required: true
  }
})

const conditionIcon = computed(() => getNWSConditionIcon(props.day.daily.icon))
</script>

<style scoped></style>
