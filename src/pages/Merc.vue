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

      <!-- DEV-ONLY: switch between seeded test agents to exercise mine-vs-marketplace + the sheet.
           Self-positions top-left (it's a v-menu, which swallows fall-through layout classes). -->
      <merc-dev-agent-switcher v-if="isDev" />

      <Transition name="merc-fade">
        <v-sheet
          v-if="mercLayoutStore.view === 'list'"
          color="background"
          class="merc-shell__list position-absolute d-flex align-center justify-center"
        >
          <span class="text-medium-emphasis">List view — coming soon</span>
        </v-sheet>
      </Transition>

      <!-- Fly-out: custom slide-up panel within the stage, originating at the top of the nav.
           TODO: MER-9: wire Capacitor hardware back to close an open sheet first (needs the
           @capacitor/app dep — deferred to the native-shim follow-up). -->
      <Transition name="merc-scrim">
        <v-sheet v-if="mercLayoutStore.activeSheet" @click="mercLayoutStore.close" class="merc-shell__scrim position-absolute" />
      </Transition>
      <Transition name="merc-sheet">
        <v-sheet
          v-if="mercLayoutStore.activeSheet"
          color="transparent"
          class="merc-shell__sheet position-absolute"
          :class="{ 'merc-shell__sheet--fixed': isSheetFixed }"
        >
          <!-- Cross-fade the body on sheet switch. Simultaneous (NOT mode="out-in": out-in queues on
               rapid toggles and can strand the body, leaving an empty bordered wrapper frozen on
               screen). The leaving body is taken out of flow (.merc-fade-leave-active) so old/new
               overlap without a jump; the wrapper's fixed height keeps it stable. -->
          <Transition name="merc-fade">
            <component :is="activeSheetComponent" :key="mercLayoutStore.activeSheet" @close="mercLayoutStore.close" />
          </Transition>
        </v-sheet>
      </Transition>
    </v-sheet>

    <merc-bottom-nav class="flex-shrink-0" />
  </v-theme-provider>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMercLayoutStore } from '@/stores/mercLayoutStore'
import MercTopBar from '@/components/merc/shell/MercTopBar.vue'
import MercMapCanvas from '@/components/merc/map/MercMapCanvas.vue'
import MercDevAgentSwitcher from '@/components/merc/map/MercDevAgentSwitcher.vue'
import MercViewToggle from '@/components/merc/shell/MercViewToggle.vue'
import MercBottomNav from '@/components/merc/shell/MercBottomNav.vue'
import MercShowingsSheet from '@/components/merc/showings/MercShowingsSheet.vue'
import MercPostAShowingWrapper from '@/components/merc/showings/MercPostAShowingWrapper.vue'
import MercWalletSheet from '@/components/merc/wallet/MercWalletSheet.vue'
import MercProfileSheet from '@/components/merc/profile/MercProfileSheet.vue'

const mercLayoutStore = useMercLayoutStore()
const isDev = import.meta.env.DEV

// Each bottom-nav fly-out maps to its sheet component, so the template stays a single dynamic
// <component> instead of an if/else-if ladder. Keys match mercLayoutStore.activeSheet.
const SHEET_COMPONENTS = {
  showings: MercShowingsSheet,
  post: MercPostAShowingWrapper,
  wallet: MercWalletSheet,
  me: MercProfileSheet
}

// The post sheet is a form (tabs + a pinned Post button), so it ALWAYS uses the fixed/pinned layout —
// the varying default (whole-sheet scroll) would push its tabs + submit button off screen.
const isSheetFixed = computed(() => mercLayoutStore.fixedSheetSize || mercLayoutStore.activeSheet === 'post')

const activeSheetComponent = computed(() => SHEET_COMPONENTS[mercLayoutStore.activeSheet] ?? null)

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
  /* Default (toggle OFF): height varies with content, capped at this max; if a sheet exceeds the cap
     the whole sheet scrolls. The merc-fade transition smooths the size change. Sheets that must keep
     a header/footer pinned (the post form) are forced into the fixed layout below — see Merc.vue's
     wrapper :class. (Pinned-header + body-scroll needs a definite height, which is the fixed mode.) */
  max-height: 68%;
  overflow-y: auto;
  /* Border + rounded top so the fly-out reads clearly against the dark map behind it. */
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-bottom: none;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

/* Toggle ON (or a sheet that forces it, e.g. the post form): fixed height — the card fills it and
   pins its header/footer while only the body (.v-card-text) scrolls. */
.merc-shell__sheet--fixed {
  height: 68%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.merc-shell__sheet--fixed :deep(.merc-sheet) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.merc-shell__sheet--fixed :deep(.merc-sheet > .v-card-text) {
  flex: 1 1 auto;
  min-height: 0;
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
