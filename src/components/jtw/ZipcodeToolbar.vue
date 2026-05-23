<template>
  <v-combobox
    ref="zipcodeInputRef"
    v-model="zipcodeTextFieldValue"
    @keyup.enter="handleZipcodeSubmit()"
    :items="zipSuggestions"
    :item-title="(item) => (typeof item === 'string' ? item : item.zipcode)"
    item-value="zipcode"
    :return-object="false"
    :menu-props="{ contentClass: 'border-md rounded-lg' }"
    :list-props="{ class: 'py-0' }"
    placeholder="Enter ZIP code"
    variant="outlined"
    width="300"
    maxlength="5"
    inputmode="numeric"
    hide-details
    single-line
    rounded="xl"
    clearable
    density="compact"
    :disabled="isGettingLocation"
  >
    <template #item="{ item, props, index }">
      <v-list-item
        v-bind="props"
        :title="item.zipcode"
        :subtitle="item.city && item.state ? `${item.city}, ${item.state}` : ''"
        class="pl-1 pr-1"
      >
        <template #prepend>
          <v-btn
            @click.stop="useUserStore().removeLocationFromLocalStorage(item.zipcode)"
            icon
            variant="plain"
            size="small"
            color="error"
            class="me-1"
            aria-label="Remove this zip"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </template>
        <template #append>
          <v-btn
            icon
            variant="plain"
            size="default"
            disabled
            aria-label="Set as home zip (coming soon)"
          >
            <v-icon>
              mdi-home-outline
            </v-icon>
          </v-btn>
          <v-btn
            @click.stop="selectAndSubmit(item.zipcode)"
            icon
            variant="plain"
            size="default"
            color="info"
            aria-label="Load forecast for this zip"
          >
            <v-icon>
              mdi-google-downasaur
            </v-icon>
          </v-btn>
        </template>
      </v-list-item>
      <v-divider v-if="index < zipSuggestions.length - 1" class="opacity-25" />
    </template>
    <template #prepend-inner>
      <v-btn
        @click="refreshAutoLocator()"
        icon
        variant="plain"
        color="info"
        aria-label="Use my location"
      >
        <v-icon :class="{ 'spin-pulse': isGettingLocation }" size="35">
          mdi-crosshairs-gps
        </v-icon>
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
        <v-icon :class="{ 'spin-pulse': isGettingLocation }" size="35">
          mdi-google-downasaur
        </v-icon>
      </v-btn>
    </template>
  </v-combobox>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { KEYBOARD_BLUR_DELAY_MS } from '@/config/appDefaults.js'
import { computed, nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'

const zipcodeInputRef = ref(null)
const { zipcodeTextFieldValue } = storeToRefs(useWeatherDataStore())
const { isGettingLocation, savedLocations } = storeToRefs(useUserStore())
// TODO: TG-74: replace with "has a place been selected" check; remove maxlength + inputmode="numeric" from template
const isValidZip = computed(() => /^\d{5}$/.test(zipcodeTextFieldValue.value))

// TODO: TG-74: replace with live Places Autocomplete results; show savedLocations as pre-typed suggestions before user types
const zipSuggestions = computed(() =>
  savedLocations.value.map((loc) => ({
    zipcode: loc.zipcode,
    city: loc.city,
    state: loc.state
  }))
)

function selectAndSubmit(zipcode) {
  zipcodeTextFieldValue.value = zipcode
  nextTick(() => handleZipcodeSubmit())
}

function handleZipcodeSubmit() {
  useWeatherDataStore()
    .getWeatherForecastForThisZipcode()
    // import.meta.env.VITE_USE_MOCK_WEATHER_DATA

  // It's either this or a nextTick() to properly close the mobile keyboards when the user hits send button.
  setTimeout(() => {
    zipcodeInputRef.value?.blur()
  }, KEYBOARD_BLUR_DELAY_MS)
}

const refreshAutoLocator = async () => {
  await useUserStore().getUserLocation()
  await useWeatherDataStore().getWeatherForecastForThisZipcode()
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
