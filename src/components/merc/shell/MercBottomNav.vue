<template>
  <!-- Merc shell bottom nav: Map / Showings / (+) / Wallet / Me. The center + is a raised FAB.
       Talks to the layout store directly (no emit bubbling). Height mirrors BlueFire's bottom-nav
       shim (extra height on native for the gesture inset). -->
  <v-sheet color="surface" elevation="10" class="merc-bottom-nav border-t-sm" :height="navHeight">
    <v-row no-gutters align="center" class="fill-height">
      <v-col v-for="item in leftItems" :key="item.key" class="text-center">
        <v-btn
          @click="mercLayoutStore.selectNavDestination(item.key)"
          :color="mercLayoutStore.navSelection === item.key ? 'primary' : 'medium-emphasis'"
          variant="text"
          stacked
          size="small"
          block
        >
          <v-icon size="28">
            {{ item.icon }}
          </v-icon>
          <span class="text-caption">{{ item.label }}</span>
        </v-btn>
      </v-col>

      <v-col cols="auto" class="text-center px-2">
        <v-btn
          @click="mercLayoutStore.openPost()"
          icon="mdi-plus"
          color="secondary"
          size="x-large"
          elevation="6"
          class="merc-fab"
        />
      </v-col>

      <v-col v-for="item in rightItems" :key="item.key" class="text-center">
        <v-btn
          @click="mercLayoutStore.selectNavDestination(item.key)"
          :color="mercLayoutStore.navSelection === item.key ? 'primary' : 'medium-emphasis'"
          variant="text"
          stacked
          size="small"
          block
        >
          <v-icon size="28">
            {{ item.icon }}
          </v-icon>
          <span class="text-caption">{{ item.label }}</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup>
import { useMercLayoutStore } from '@/stores/mercLayoutStore'

import { MERC_BOTTOM_NAV_HEIGHT, MERC_BOTTOM_NAV_HEIGHT_NATIVE } from '@/configs/mercDefaults'

import { Capacitor } from '@capacitor/core'

const mercLayoutStore = useMercLayoutStore()
const navHeight = Capacitor.isNativePlatform() ? MERC_BOTTOM_NAV_HEIGHT_NATIVE : MERC_BOTTOM_NAV_HEIGHT

const leftItems = [
  { key: 'map', icon: 'mdi-map-marker', label: 'Map' },
  { key: 'showings', icon: 'mdi-text-box-search-outline', label: 'Showings' }
]
const rightItems = [
  { key: 'wallet', icon: 'mdi-wallet-outline', label: 'Wallet' },
  { key: 'me', icon: 'mdi-account-circle-outline', label: 'Me' }
]
</script>

<style scoped>
.merc-bottom-nav {
  /* Clear the home-indicator inset on device. */
  padding-bottom: var(--inset-bottom, 0px);
  /* Sit above the map's stacking context so the raised + FAB is never covered. */
  position: relative;
  z-index: 2;
}

/* Lift the (larger) center action button above the bar. */
.merc-fab {
  transform: translateY(-20px);
}
</style>
