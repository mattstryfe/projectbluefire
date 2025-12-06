<template>
  <v-app>
    <main-app-header />

    <v-navigation-drawer
      v-model="showNavigationDrawer"
      temporary
      width="120"
      class="pa-2"
    >
      <recent-locations />
    </v-navigation-drawer>

    <v-main>
      <v-pull-to-refresh @load="refreshApp" class="" :pull-down-threshold="100">
        <template #pullDownPanel>
          <v-row class="mt-3">
            <v-col class="text-center" col="3">
              <v-progress-circular
                color="primary"
                indeterminate
                :size="40"
                :width="6"
              ></v-progress-circular>
              <h6 class="text-caption mt-2">Refreshing data...</h6>
            </v-col>
          </v-row>
        </template>
        <v-container fluid>
          <router-view />
        </v-container>
      </v-pull-to-refresh>
    </v-main>
    <mobile-bottom-navigation-menu />
  </v-app>
</template>

<script setup>
import MainAppHeader from '@/components/navigation/MainAppHeader.vue'
// Vuetify Shorthand for responsiveness across app
// saves from needing to import and destructure in each component.
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import MobileBottomNavigationMenu from '@/components/navigation/MobileBottomNavigationMenu.vue'
import RecentLocations from '@/components/jtw/RecentLocations.vue'

const { showNavigationDrawer } = storeToRefs(useUserStore())
// Destructure the specific breakpoint properties you want to provide

async function refreshApp({ done }) {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  // Resets entire store
  // useEntryFormStore().$reset()
  //
  // // Re-init entry store to repopulate from ground up
  // await useEntryFormStore().setupEntriesListener()
  done('ok')
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
