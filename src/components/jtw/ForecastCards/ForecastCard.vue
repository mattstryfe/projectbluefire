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
      <v-row no-gutters align="center" class="text-label-small mb-1">
        <v-col />
        <v-col cols="auto" class="d-flex align-center">
          <v-icon size="12" class="mr-1" :color="precipIconColor">
            mdi-water-outline
          </v-icon>
          {{ precipDisplay }}
        </v-col>
        <v-col class="d-flex align-center pl-1">
          <v-tooltip v-if="hasDivergence" :text="otherPrecipLabel" location="top" open-on-click>
            <template #activator="{ props: tooltipProps }">
              <v-icon v-bind="tooltipProps" size="15" color="grey">
                mdi-information-outline
              </v-icon>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script setup>
import { computed, toRef } from 'vue'
import { getNWSConditionIcon, getNWSConditionColor } from '@/utils/weatherUtils.js'
import { PRECIP_CHANCE_THRESHOLD } from '@/config/appDefaults.js'
import { usePrecipDisplay } from '@/composables/usePrecipDisplay.js'

const props = defineProps({
  day: {
    type: Object,
    required: true
  }
})

const conditionIcon = computed(() => getNWSConditionIcon(props.day.daily.icon))
const conditionColor = computed(() => getNWSConditionColor(props.day.daily.icon, props.day.daily.high))
const popIconColor = computed(() => props.day.daily.probabilityOfPrecipitation > PRECIP_CHANCE_THRESHOLD ? 'blue-lighten-2' : 'grey')
const { precipIconColor, precipDisplay, hasDivergence, otherPrecipLabel } = usePrecipDisplay(toRef(props, 'day'))
</script>

<style scoped></style>
