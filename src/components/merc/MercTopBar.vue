<template>
  <!-- Merc shell top bar: BlueFire "home" mark (back to the main app), then a full-width search
       with the filter control and the future notification-bell slot as append icons. Pulls
       BlueFire's safe-area inset shim. -->
  <v-sheet color="surface" elevation="3" class="merc-top-bar px-3 pb-2">
    <v-row no-gutters align="center">
      <v-col cols="auto" class="mr-2">
        <v-btn @click="goHome" icon variant="text" aria-label="Back to Project Bluefire">
          <v-icon size="30" class="burning-blue-fire-intense flame-rotate-315">
            mdi-fire
          </v-icon>
        </v-btn>
      </v-col>

      <v-col>
        <v-text-field
          v-model="query"
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          density="compact"
          rounded="lg"
          hide-details
          flat
        >
          <template #append-inner>
            <v-icon class="merc-top-bar__action mr-1">
              mdi-tune-variant
            </v-icon>
            <!-- Notification bell slot (placeholder per MER-9; wired in a later ticket) -->
            <v-icon class="merc-top-bar__action">
              mdi-bell-outline
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = ref('')

// Hop back to the main BlueFire app — leaving /merc/app restores BlueFire's chrome (App.vue).
function goHome() {
  router.push('/')
}
</script>

<style scoped>
.merc-top-bar {
  /* Reuse BlueFire's safe-area shim so the bar clears the status bar / notch on device. */
  padding-top: calc(var(--inset-top, 0px) + 8px);
  /* Sit above the map's stacking context. */
  position: relative;
  z-index: 2;
}

.merc-top-bar__action {
  cursor: pointer;
}
</style>
