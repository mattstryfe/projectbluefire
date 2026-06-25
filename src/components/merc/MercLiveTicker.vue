<template>
  <v-sheet color="transparent" rounded="lg" class="merc-ticker-sheet d-flex align-center px-3 py-2">
    <v-chip size="small" color="info" variant="tonal" class="mr-3 flex-shrink-0">
      <v-icon start size="x-small" class="merc-live-dot">
        mdi-circle
      </v-icon>
      LIVE
    </v-chip>

    <Transition name="merc-ticker" mode="out-in">
      <span :key="index" class="merc-ticker__row d-flex align-center flex-grow-1">
        <span class="merc-ticker__msg text-body-2 text-truncate flex-grow-1">
          <strong>{{ current.agent }}</strong>
          {{ current.action }}
          <strong class="text-primary">${{ current.amount }}</strong>
          in {{ current.neighborhood }}
        </span>
        <span class="text-caption text-medium-emphasis ml-3 flex-shrink-0">{{ current.minutesAgo }}m ago</span>
      </span>
    </Transition>
  </v-sheet>
</template>

<script setup>
import { useMockLandingTicker } from '@/mocks/mockLandingFeed'

// All data + rotation live in the mock module so they're easy to rip out for real data.
const { current, index } = useMockLandingTicker()
</script>

<style scoped>
/* Dashed, transparent container (per the design doc) — visually distinct from the solid pill
   CTA so the ticker doesn't read as a button. */
.merc-ticker-sheet {
  background-color: transparent !important;
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

/* min-width:0 lets the message truncate inside the nested flex row. */
.merc-ticker__row,
.merc-ticker__msg {
  min-width: 0;
}

/* Pulsing LIVE dot */
.merc-live-dot {
  animation: merc-pulse 1.4s ease-in-out infinite;
}

@keyframes merc-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.35;
    transform: scale(0.7);
  }
}

/* Rotate items in/out vertically */
.merc-ticker-enter-active,
.merc-ticker-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.merc-ticker-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.merc-ticker-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
