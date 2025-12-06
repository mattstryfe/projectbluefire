<template>
  <v-row>
    <div class="px-4 mx-auto">
      <v-text-field
        ref="zipcodeInput"
        density="compact"
        placeholder=" zipcode..."
        variant="outlined"
        width="200"
        flat
        hide-details
        single-line
        v-model="zipcodeTextFieldValue"
        clearable
        @keyup.enter="handleZipcodeSubmit()"
      >
        <template #append-inner>
          <v-btn
            icon="mdi-send"
            variant="text"
            density="compact"
            color="info"
            @click="handleZipcodeSubmit()"
          ></v-btn>
        </template>

        <template v-slot:append>
          <v-btn
            color="medium-emphasis"
            density="compact"
            icon="mdi-crosshairs-gps"
            @click="refreshLocation()"
          ></v-btn>
        </template>
      </v-text-field>
    </div>
  </v-row>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'

const zipcodeInput = ref(null)
const { zipcodeTextFieldValue } = storeToRefs(useWeatherDataStore())
const showCachedAlert = ref(true)

function handleZipcodeSubmit() {
  useWeatherDataStore().getWeatherForecastForThisZipcode()
  // It's either this or a nextTick() to properly close the mobile keyboards when the user hits send button.
  setTimeout(() => {
    zipcodeInput.value?.blur()
  }, 100)
}

const refreshLocation = async () => {
  await useUserStore().getUserLocation()
  showCachedAlert.value = true
  setTimeout(() => {
    showCachedAlert.value = false
  }, 5000)
}
</script>

<style scoped></style>
