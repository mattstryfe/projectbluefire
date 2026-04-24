<template>
  <v-chip-group v-model="zipcodeTextFieldValue" column selected-class="text-info">
    <v-tooltip
      v-for="location in savedLocations"
      :key="location.zipcode"
      :disabled="!isChipFailed(location.zipcode)"
      location="bottom"
    >
      <template #activator="{ props: tooltipProps }">
        <span v-bind="tooltipProps" class="d-inline-flex align-center">
          <v-chip
            @click:close="removeLocationFromLocalStorage(location.zipcode)"
            @click="isChipFailed(location.zipcode) ? null : useThisChipsZipcode(location)"
            :value="location.zipcode"
            :class="{ 'chip-failed': isChipFailed(location.zipcode) }"
            closable
            variant="outlined"
            color="grey"
            border="sm"
            class="mr-1"
          >
            {{ location.zipcode }}
          </v-chip>
          <v-icon
            v-if="isChipFailed(location.zipcode)"
            size="x-small"
            color="info"
            class=""
          >
            mdi-information
          </v-icon>
        </span>
      </template>
      <span>This ZIP code could not be resolved to a forecast area</span>
    </v-tooltip>
  </v-chip-group>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore.js'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'

const { removeLocationFromLocalStorage } = useUserStore()
const { savedLocations, failedZipcodes, userGeoCoords } = storeToRefs(useUserStore())
const { zipcodeTextFieldValue } = storeToRefs(useWeatherDataStore())

function isChipFailed(zipcode) {
  return failedZipcodes.value.has(zipcode)
}

function useThisChipsZipcode(location) {
  userGeoCoords.value = location
  zipcodeTextFieldValue.value = location.zipcode
  useWeatherDataStore().getWeatherForecastForThisZipcode()
}
</script>

<style scoped>
.chip-failed {
  opacity: 0.5;
  pointer-events: auto;
  cursor: default;
}
</style>
