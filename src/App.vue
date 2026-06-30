<template>
  <v-app>
    <main-app-header v-if="!isMercApp" />
    <v-main>
      <v-pull-to-refresh v-if="isNative && !isMercApp" @load="refreshApp" :pull-down-threshold="PULL_TO_REFRESH_THRESHOLD_PX">
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
    <mobile-bottom-navigation-menu v-if="!isMercApp" />
    <toast-notification-stack :class="{ 'toast--merc': isMercApp }" />
  </v-app>
</template>

<script setup>
import MainAppHeader from '@/components/navigation/MainAppHeader.vue'
import ToastNotificationStack from '@/components/ToastNotificationStack.vue'
import { useRoute } from 'vue-router'
import { computed, nextTick } from 'vue'
import { PULL_TO_REFRESH_THRESHOLD_PX } from '@/configs/appDefaults.js'
import { Capacitor } from '@capacitor/core'
import { useWeatherDataStore } from '@/stores/weatherDataStore'
import MobileBottomNavigationMenu from '@/components/navigation/MobileBottomNavigationMenu.vue'

const route = useRoute()
const isNative = Capacitor.isNativePlatform()

// On the Merc shell (/merc/app), BlueFire's chrome hands off to Merc's own top bar + bottom nav.
const isMercApp = computed(() => route.path.startsWith('/merc/app'))

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

<style>
/*Fixes alignment & layout issues caused from this being in labs probably.*/
.v-pull-to-refresh,
.v-pull-to-refresh__scroll-container {
  height: 100%;
}

:root {
  --inset-top: env(safe-area-inset-top);
  --inset-bottom: env(safe-area-inset-bottom);
}

body,
.v-navigation-drawer {
  padding-top: var(--inset-top) !important;
}

.v-app-bar {
  padding-top: var(--inset-top) !important;
}
</style>
