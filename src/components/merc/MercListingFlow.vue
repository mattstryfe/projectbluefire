<template>
  <!-- "How a listing works" — compact 3-step flow: icons side by side with arrows between, so it
       reads the same on mobile and desktop (no stacking). List/Claim are Merc blue, Profit is the
       green payout ($). Claim's map uses currentColor for its neutral lines so it adapts to theme. -->
  <section class="text-center mx-auto merc-listing-flow">
    <!--    <p class="text-overline text-medium-emphasis mb-3">
      How it works
    </p>-->

    <v-row align="start" justify="center" no-gutters class="flex-nowrap">
      <!-- 1 — list -->
      <v-col class="merc-flow-step text-center">
        <v-icon icon="mdi-map-marker" size="72" color="#3b82f6" />
        <p class="text-caption text-medium-emphasis mt-1 mb-0">
          List
        </p>
      </v-col>

      <v-col cols="auto" class="merc-flow-arrow">
        <v-icon icon="mdi-arrow-right" size="22" color="medium-emphasis" />
      </v-col>

      <!-- 2 — claim -->
      <v-col class="merc-flow-step text-center">
        <svg class="merc-flow-icon" viewBox="0 0 72 72" role="img" aria-label="Claim">
          <rect x="8" y="16" width="56" height="40" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.22" stroke-width="1.5" />
          <path d="M26 16V56M46 16V56M8 36H64" fill="none" stroke="currentColor" stroke-opacity="0.14" stroke-width="1" />
          <circle cx="18" cy="45" r="3" fill="currentColor" opacity="0.4" />
          <circle cx="55" cy="26" r="3" fill="currentColor" opacity="0.4" />
          <circle cx="36" cy="36" r="12" fill="#3b82f6" opacity="0.18" />
          <circle cx="36" cy="36" r="5.5" fill="#3b82f6" />
        </svg>
        <p class="text-caption text-medium-emphasis mt-1 mb-0">
          Claim
        </p>
      </v-col>

      <v-col cols="auto" class="merc-flow-arrow">
        <v-icon icon="mdi-arrow-right" size="22" color="medium-emphasis" />
      </v-col>

      <!-- 3 — profit -->
      <v-col class="merc-flow-step text-center">
        <v-icon icon="mdi-currency-usd" size="72" color="#22c55e" />
        <p class="text-caption text-medium-emphasis mt-1 mb-0">
          Profit
        </p>
      </v-col>
    </v-row>
  </section>
</template>

<script setup>
// Static presentational component (MER-26 landing polish) — no props or state yet.
</script>

<style scoped>
/* Keep the flow tidy and centered on wide screens; fills the width on mobile. */
.merc-listing-flow {
  max-width: 520px;
}

.merc-flow-icon {
  display: block;
  width: 72px;
  height: 72px;
  margin: 0 auto;
}

/* Sit the arrow at the icons' vertical center (icon is 72px tall, arrow ~22px). */
.merc-flow-arrow {
  margin-top: 25px;
}
</style>
