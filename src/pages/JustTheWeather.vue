<template>
  <v-row>
    <v-alert density="compact" variant="outlined" color="info" v-if="isLoading">
      <v-icon size="large">mdi-information-slab-circle-outline</v-icon>
      <span class="pl-2">Getting location information...</span>
    </v-alert>
    <v-alert
      density="compact"
      variant="outlined"
      color="success"
      v-model="showCachedAlert"
      closable
      v-else-if="userGeoCoords?.timestamp"
    >
      <v-icon size="small">mdi-cached</v-icon>
      <span class="pl-2">Using cached location from {{ locationAge }}</span>
    </v-alert>
  </v-row>
  <v-row>
    <v-col class="d-flex align-center justify-center">
      <v-btn
        icon
        variant="text"
        size="75"
        @click="refreshLocation"
      >
        <v-icon color="info" size="75" :class="{ rotating: isLoading }">
          {{ isLoading ? 'mdi-target' : 'mdi-target-account' }}
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
  <v-row v-if="userGeoCoords">
    <v-col class="d-flex align-center justify-center">
      <v-chip
        size="small"
        variant="outlined"
        :color="isLocationFresh ? 'success' : 'info'"
        prepend-icon="mdi-clock-outline"
      >
        {{ locationAge }}
      </v-chip>
    </v-col>
  </v-row>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { onMounted, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

const { isLoading, userGeoCoords } = storeToRefs(useUserStore())
const showCachedAlert = ref(true)

const isLocationFresh = computed(() => {
  if (!userGeoCoords.value?.timestamp) return false
  return Date.now() - userGeoCoords.value.timestamp < 60000 // < 1 minute
})

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

const refreshLocation = async () => {
  await useUserStore().getUserLocation(true)
  showCachedAlert.value = true
  setTimeout(() => {
    showCachedAlert.value = false
  }, 5000)
}

onMounted(async () => {
  await useUserStore().getUserLocation()
  setTimeout(() => {
    showCachedAlert.value = false
  }, 5000)
})
</script>

<style scoped>
.rotating {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
