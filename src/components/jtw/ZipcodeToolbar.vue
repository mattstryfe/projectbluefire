<template>
  <v-col cols="auto">
    <!-- TODO: TG-44 -->
    <v-text-field
      ref="zipcodeInputRef"
      v-model="zipcodeTextFieldValue"
      @keyup.enter="handleZipcodeSubmit()"
      class=""
      density="compact"
      placeholder="Enter ZIP code"
      variant="outlined"
      width="250"
      maxlength="5"
      inputmode="numeric"
      hide-details
      single-line
      clearable
      :disabled="isGettingLocation"
    >
      <template #prepend-inner>
        <v-btn
          @click="refreshAutoLocator()"
          icon
          variant="plain"
          color="info"
          aria-label="Use my location"
        >
          <v-icon :class="{ 'spin-pulse': isGettingLocation }" size="30">mdi-crosshairs-gps</v-icon>
        </v-btn>
      </template>
      <template #append-inner>
        <v-divider vertical thickness="1"></v-divider>
        <v-btn
          @click="handleZipcodeSubmit()"
          icon
          variant="plain"
          color="info"
          aria-label="Get forecast"
          :disabled="isGettingLocation || !isValidZip"
        >
          <v-icon :class="{ 'spin-pulse': isGettingLocation }" size="30">
            mdi-google-downasaur
          </v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </v-col>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'

const zipcodeInputRef = ref(null)
const { zipcodeTextFieldValue } = storeToRefs(useWeatherDataStore())
const { isGettingLocation } = storeToRefs(useUserStore())
const showCachedAlert = ref(true)
const isValidZip = computed(() => /^\d{5}$/.test(zipcodeTextFieldValue.value))

function handleZipcodeSubmit() {
  useWeatherDataStore()
    .getWeatherForecastForThisZipcode
    // import.meta.env.VITE_USE_MOCK_WEATHER_DATA
    ()

  // It's either this or a nextTick() to properly close the mobile keyboards when the user hits send button.
  setTimeout(() => {
    zipcodeInputRef.value?.blur()
  }, 100)
}

const refreshAutoLocator = async () => {
  // clear existing forecast data
  useWeatherDataStore().clearForecast()

  await useUserStore().getUserLocation()
  showCachedAlert.value = true
  setTimeout(() => {
    showCachedAlert.value = false
  }, 5000)
}
</script>

<style scoped>
/* Slower, smoother spin */
.spin-pulse {
  animation: spin-pulse 1.5s ease-in-out infinite;
}

@keyframes spin-pulse {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
  50% {
    transform: rotate(180deg) scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 1;
  }
}
:deep(.v-field__input) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  align-self: center;
}
</style>
