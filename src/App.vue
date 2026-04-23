<template>
  <v-app>
    <main-app-header />

    <v-navigation-drawer v-model="showNavigationDrawer" temporary width="120" class="pa-2">
      <recent-locations />
    </v-navigation-drawer>

    <v-main>
      <v-pull-to-refresh v-if="isNative" @load="refreshApp" :pull-down-threshold="100">
        <template #pullDownPanel>
          <v-row class="mt-3">
            <v-col class="text-center" col="3">
              <v-progress-circular color="primary" indeterminate :size="40" :width="6" />
              <h6 class="text-caption mt-2">
                Refreshing data...
              </h6>
            </v-col>
          </v-row>
        </template>
        <v-container fluid>
          <router-view />
        </v-container>
      </v-pull-to-refresh>

      <v-container v-else fluid>
        <router-view />
      </v-container>
    </v-main>
    <mobile-bottom-navigation-menu />
  </v-app>
</template>

<script setup>
import MainAppHeader from '@/components/navigation/MainAppHeader.vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { nextTick } from 'vue'
import { Capacitor } from '@capacitor/core'
import { useUserStore } from '@/stores/userStore'
import { useWeatherDataStore } from '@/stores/weatherDataStore'
import MobileBottomNavigationMenu from '@/components/navigation/MobileBottomNavigationMenu.vue'
import RecentLocations from '@/components/jtw/RecentLocations.vue'

const route = useRoute()
const { showNavigationDrawer } = storeToRefs(useUserStore())
const isNative = Capacitor.isNativePlatform()

async function refreshApp({ done }) {
  try {
    const weatherStore = useWeatherDataStore()
    const isOnJTW = route.name === 'Just The Weather (JTW)'

    if (isOnJTW && weatherStore.zipcodeTextFieldValue) {
      await weatherStore.getWeatherForecastForThisZipcode()
    }
  } finally {
    // nextTick ensures refreshing.value = true has been set by the component
    // before done() checks it — avoids the spinner getting stuck
    await nextTick()
    done()
  }
}
</script>

<style scoped>
/* Only apply on mobile screens */
@media (max-width: 600px) {
  .v-navigation-drawer {
    padding-top: calc(var(--inset-top) + 48px) !important;
  }
}
</style>

<style>
/*Fixes alignment & layout issues caused from this being in labs probably.*/
.v-pull-to-refresh,
.v-pull-to-refresh__scroll-container {
  height: 100%;
}

:root {
  --inset-top: env(safe-area-inset-top);
}

body,
.v-navigation-drawer,
.v-overlay__content > .v-card {
  padding-top: var(--inset-top) !important;
}

.v-app-bar {
  padding-top: var(--inset-top) !important;
}
</style>
