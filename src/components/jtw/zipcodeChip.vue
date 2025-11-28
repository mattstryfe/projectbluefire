<template>
  <v-chip-group selected-class="text-info" v-model="zipcodeTextFieldValue">
    <v-chip
      v-for="location in savedLocations"
      :key="location.zipcode"
      :value="location.zipcode"
      closable
      @click:close="removeLocationFromLocalStorage(location.zipcode)"
      @click="useThisChipsZipcode(location)"
      variant="outlined"
      color="grey"
      border="sm"
    >
      {{ location.zipcode }}
    </v-chip>
  </v-chip-group>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore.js'
import { ref } from 'vue'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'

const selectedZipcode = ref()
const { removeLocationFromLocalStorage } = useUserStore()
const { savedLocations, userGeoCoords } = storeToRefs(useUserStore())
const { zipcodeTextFieldValue } = storeToRefs(useWeatherDataStore())

function useThisChipsZipcode(location) {
  console.log('location', location)
  console.log('savedLocations', savedLocations.value)
  //Inject userGeoCoords with what it needs
  userGeoCoords.value = location
  zipcodeTextFieldValue.value = location.zipcode
  useWeatherDataStore().getWeatherForecastForThisZipcode()
  console.log('selectedZipcode', selectedZipcode.value)
}
</script>

<style scoped></style>
