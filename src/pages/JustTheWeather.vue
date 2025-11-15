<template>
  <v-row>
    <v-col>
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
  <v-row>
    <v-col>
      <h6>Recent Locations:</h6>
      <zipcode-chip />

      <!--      <v-chip class="border-sm" color="green" @click="">
        <v-icon>mdi-plus</v-icon>
      </v-chip>-->
    </v-col>
  </v-row>

  <v-row class="justify-center">
    <v-col cols="5">
      <v-chip class="border-sm" color="grey" @click="refreshLocation">
        <p>{{ isLoading ? 'Using' : 'Use' }} Current Loc</p>
        <v-icon color="info" :class="{ rotating: isLoading }" class="pl-2">
          {{ isLoading ? 'mdi-target' : 'mdi-target-account' }}
        </v-icon>
      </v-chip>
    </v-col>
    <v-col cols="auto" class="d-flex pl-0">
      <v-divider class="" color="info" thickness="5" vertical></v-divider>
    </v-col>
    <v-col cols="5">
      <v-text-field
        variant="outlined"
        density="compact"
        placeholder=" "
        label="zipcode"
        hide-details
        persistent-placeholder
        v-model="zipcode"
        clearable
      >
        <template #append-inner>
          <v-btn
            icon="mdi-send"
            variant="text"
            density="compact"
            color="info"
            @click="useUserStore().getUserLocationUsingManualZipcode(zipcode)"
          ></v-btn>
        </template>
      </v-text-field>
    </v-col>
  </v-row>

  <v-row justify="center">
    <v-col cols="auto">
      <h1>{{ userGeoCoords?.zipcode }}</h1>
    </v-col>
  </v-row>

  <!-- TODO: change this chip to simply display the zipcode one we have lookups working -->
  <!-- TODO: add a 'get my location' chip' and add bullseyes on the other ones to use historically saved geoCoords -->
  <v-row v-if="userGeoCoords" justify="center">
    <v-col cols="auto">
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
import ZipcodeChip from '@/components/jtw/zipcodeChip.vue'

const { isLoading, userGeoCoords } = storeToRefs(useUserStore())
const showCachedAlert = ref(true)
const zipcode = ref('20120')

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
