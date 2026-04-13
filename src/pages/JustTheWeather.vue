<template>
  <v-row>
    <v-spacer></v-spacer>
    <v-col cols="12" sm="auto" class="d-flex justify-center justify-sm-end">
      <v-btn-toggle v-model="jtwViewChoice" mandatory group rounded="5" divided>
        <v-btn value="card">
          <v-icon>mdi-card-multiple</v-icon>
        </v-btn>

        <v-btn value="chart">
          <v-icon>mdi-chart-bar</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
  <v-row>
    <v-col v-if="isLoading">
      <v-fade-transition>
        <v-alert
          density="compact"
          variant="outlined"
          color="info"
          v-if="isLoading"
        >
          <v-icon size="large">mdi-information-slab-circle-outline</v-icon>
          <span class="pl-2">Getting location information...</span>
        </v-alert>
      </v-fade-transition>
      <v-fade-transition>
        <v-alert
          density="compact"
          variant="outlined"
          color="success"
          v-model="showCachedAlert"
          closable
          v-if="!isLoading && userGeoCoords?.timestamp && showCachedAlert"
        >
          <v-icon size="small">mdi-cached</v-icon>
          <span class="pl-2">Using cached location from {{ locationAge }}</span>
        </v-alert>
      </v-fade-transition>
    </v-col>
  </v-row>

  <zipcode-toolbar />

  <v-row justify="end" gap="5">
    <v-col cols="auto">
      <v-btn-toggle v-model="jtwViewChoice" mandatory group rounded="5" divided>
        <v-btn value="card">
          <v-icon>mdi-card-multiple</v-icon>
        </v-btn>

        <v-btn value="chart">
          <v-icon>mdi-chart-bar</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>

  <v-row v-if="jtwViewChoice === 'card'" gap="0">
    <card-layout-wrapper />
  </v-row>

  <v-row v-if="jtwViewChoice === 'chart'" gap="0">
    <temperature-chart />

    <precipitation-chart />
  </v-row>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { onMounted, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'
import TemperatureChart from '@/components/jtw/TemperatureChart.vue'
import PrecipitationChart from '@/components/jtw/PrecipitationChart.vue'
import ZipcodeToolbar from '@/components/jtw/ZipcodeToolbar.vue'
import CardLayoutWrapper from '@/components/jtw/CardLayoutWrapper.vue'

const { isLoading, userGeoCoords, jtwViewChoice } = storeToRefs(useUserStore())
const { zipcodeUsedInForecast } = storeToRefs(useWeatherDataStore())
const showCachedAlert = ref(true)

const locationAge = computed(() => {
  if (!userGeoCoords.value?.timestamp) return 'Unknown age'
  const seconds = Math.floor(
    (Date.now() - userGeoCoords.value.timestamp) / 1000
  )
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
})

onMounted(async () => {
  await useUserStore().getUserLocation()
  setTimeout(() => {
    showCachedAlert.value = false
  }, 5000)
})
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
