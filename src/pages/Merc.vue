<template>
  <!-- Merc app shell (MER-9). Full-bleed, mobile-first: top bar → stage (map/list + fly-outs) →
       bottom nav. BlueFire's chrome is hidden for this route (see App.vue); the Merc theme is
       scoped here so it never leaks into BlueFire. UI state lives in mercLayoutStore. -->
  <v-theme-provider theme="merc" with-background class="merc-shell">
    <merc-top-bar class="flex-shrink-0" />

    <!-- Stage owns its own stacking context (z-index:1) so the map's internal z-indexes stay
         contained and the nav/top bar (z-index:2) always paint above it. overflow:hidden clips
         the fly-out so it slides up from the top of the nav with no flash and never covers it. -->
    <v-sheet color="transparent" class="merc-shell__stage position-relative flex-grow-1">
      <merc-map-canvas class="fill-height" />

      <merc-view-toggle
        @update:model-value="mercLayoutStore.setView"
        :model-value="mercLayoutStore.view"
        class="merc-shell__view-toggle position-absolute"
      />

      <v-sheet
        v-if="mercLayoutStore.view === 'list'"
        color="background"
        class="merc-shell__list position-absolute d-flex align-center justify-center"
      >
        <span class="text-medium-emphasis">List view — coming soon</span>
      </v-sheet>

      <!-- Fly-out: custom slide-up panel within the stage, originating at the top of the nav.
           TODO: MER-9: wire Capacitor hardware back to close an open sheet first (needs the
           @capacitor/app dep — deferred to the native-shim follow-up). -->
      <Transition name="merc-scrim">
        <v-sheet v-if="mercLayoutStore.activeSheet" @click="mercLayoutStore.close" class="merc-shell__scrim position-absolute" />
      </Transition>
      <Transition name="merc-sheet">
        <v-sheet v-if="mercLayoutStore.activeSheet" color="transparent" class="merc-shell__sheet position-absolute">
          <merc-showings-sheet v-if="mercLayoutStore.activeSheet === 'showings'" @close="mercLayoutStore.close" />
          <merc-post-showing-sheet v-else-if="mercLayoutStore.activeSheet === 'post'" @close="mercLayoutStore.close" />
          <merc-wallet-sheet v-else-if="mercLayoutStore.activeSheet === 'wallet'" @close="mercLayoutStore.close" />
          <merc-profile-sheet v-else-if="mercLayoutStore.activeSheet === 'me'" @close="mercLayoutStore.close" />
        </v-sheet>
      </Transition>
    </v-sheet>

    <merc-bottom-nav class="flex-shrink-0" />
  </v-theme-provider>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMercLayoutStore } from '@/stores/mercLayoutStore'
import MercTopBar from '@/components/merc/MercTopBar.vue'
import MercMapCanvas from '@/components/merc/MercMapCanvas.vue'
import MercViewToggle from '@/components/merc/MercViewToggle.vue'
import MercBottomNav from '@/components/merc/MercBottomNav.vue'
import MercShowingsSheet from '@/components/merc/MercShowingsSheet.vue'
import MercPostShowingSheet from '@/components/merc/MercPostShowingSheet.vue'
import MercWalletSheet from '@/components/merc/MercWalletSheet.vue'
import MercProfileSheet from '@/components/merc/MercProfileSheet.vue'

const mercLayoutStore = useMercLayoutStore()

// Enter the shell on a clean slate (the store persists across navigations).
onMounted(() => mercLayoutStore.close())
</script>

<style scoped>
.merc-shell {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
}

/* Isolated stacking context: contains the map's z-indexes and clips the fly-out. */
.merc-shell__stage {
  z-index: 1;
  min-height: 0;
  overflow: hidden;
}

.merc-shell__view-toggle {
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.merc-shell__list {
  inset: 0;
  z-index: 1;
}

.merc-shell__scrim {
  inset: 0;
  z-index: 3;
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.merc-shell__sheet {
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  max-height: 88%;
  overflow-y: auto;
}

/* Slide the sheet up from the top of the nav; fade the scrim. */
.merc-sheet-enter-active,
.merc-sheet-leave-active {
  transition: transform 0.28s ease;
}

.merc-sheet-enter-from,
.merc-sheet-leave-to {
  transform: translateY(100%);
}

.merc-scrim-enter-active,
.merc-scrim-leave-active {
  transition: opacity 0.28s ease;
}

.merc-scrim-enter-from,
.merc-scrim-leave-to {
  opacity: 0;
}
</style>
