<template>
  <v-row v-if="isGettingLocation">
    <!-- TODO: TG-51 - make this a bottom v-alert or toaster -->
    <v-col>
      <v-fade-transition>
        <v-alert
          v-if="isGettingLocation"
          density="compact"
          variant="outlined"
          color="info"
        >
          <v-icon size="large">mdi-information-slab-circle-outline</v-icon>
          <span class="pl-2">Getting location information...</span>
        </v-alert>
      </v-fade-transition>
      <v-fade-transition>
        <v-alert
          v-if="
            !isGettingLocation && userGeoCoords?.timestamp && showCachedAlert
          "
          v-model="showCachedAlert"
          density="compact"
          variant="outlined"
          color="success"
          closable
        >
          <v-icon size="small">mdi-cached</v-icon>
          <span class="pl-2">Using cached location from {{ locationAge }}</span>
        </v-alert>
      </v-fade-transition>
    </v-col>
  </v-row>

  <v-row justify="center" class="mb-4">
    <zipcode-toolbar />
  </v-row>

  <v-row>
    <v-col>
      <h2>{{ currentLocation }}</h2>
    </v-col>
  </v-row>

  <v-row justify="end" gap="5">
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
import { onMounted, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import TemperatureChart from '@/components/jtw/TemperatureChart.vue'
import PrecipitationChart from '@/components/jtw/PrecipitationChart.vue'
import ZipcodeToolbar from '@/components/jtw/ZipcodeToolbar.vue'
import CardLayoutWrapper from '@/components/jtw/CardLayoutWrapper.vue'
import LayoutToggle from '@/components/jtw/LayoutToggle.vue'

const { isGettingLocation, userGeoCoords, jtwViewChoice } =
  storeToRefs(useUserStore())
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

const currentLocation = computed(
  () =>
    [userGeoCoords.value?.city, userGeoCoords.value?.state]
      .filter(Boolean)
      .join(', ') || ''
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
