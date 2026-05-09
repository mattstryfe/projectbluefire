<template>
  <v-row>
    <v-col>
      <h2>
        {{ currentLocation }}
      </h2>
    </v-col>
  </v-row>

  <v-row justify="end" gap="5">
    <v-btn v-if="isDev" @click="testsStore.spawnTestToasts" size="small" variant="tonal" color="warning">
      Test Toasts
    </v-btn>
    <layout-toggle />
  </v-row>

  <v-row v-if="jtwViewChoice === 'card'" gap="8">
    <card-layout-wrapper />
  </v-row>

  <v-row v-if="jtwViewChoice === 'chart'" gap="0">
    <temperature-chart />

    <precipitation-chart />
  </v-row>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'
import { useNotificationStore } from '@/stores/notificationStore.js'
import { useTestsStore } from '@/stores/testsStore.js'
import { CACHED_ALERT_DISMISS_MS } from '@/config/appDefaults.js'
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import TemperatureChart from '@/components/jtw/TemperatureChart.vue'
import PrecipitationChart from '@/components/jtw/PrecipitationChart.vue'
import CardLayoutWrapper from '@/components/jtw/CardLayoutWrapper.vue'
import LayoutToggle from '@/components/jtw/LayoutToggle.vue'

const isDev = import.meta.env.DEV
const testsStore = useTestsStore()
const { userGeoCoords, jtwViewChoice } = storeToRefs(useUserStore())

function formatLocationAge(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

onMounted(async () => {
  const userStore = useUserStore()

  if (userStore.isGeoLocationStale()) {
    await userStore.getUserLocation()
  } else if (userStore.userGeoCoords?.timestamp) {
    useNotificationStore().addNotification({
      message: `Using cached location from ${formatLocationAge(userStore.userGeoCoords.timestamp)}`,
      color: 'success',
      icon: 'mdi-cached',
      timeout: CACHED_ALERT_DISMISS_MS
    })
  }

  if (userStore.userGeoCoords?.zipcode) {
    await useWeatherDataStore().getWeatherForecastForThisZipcode()
  }
})

const currentLocation = computed(
  () => [userGeoCoords.value?.city, userGeoCoords.value?.state].filter(Boolean).join(', ') || ''
)
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
