<template>
  <v-row justify="center" class="px-2">
    <v-col cols="12" md="10" lg="8">
      <!-- Headline (marketplace message) — floated down from the top bar with breathing room -->
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 text-md-h3 font-weight-bold mb-4">
            Hand off a live showing. The payout handles itself.
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Post a showing — from your listings or a dropped pin — and attach a payout. Nearby agents
            browse open showings on a map, bid to cover them, and get paid from escrow the moment the
            appointment's confirmed.
          </p>
        </v-col>
      </v-row>

      <!-- How a listing works -->
      <v-row class="mt-8 mb-15">
        <v-col cols="12">
          <merc-listing-flow />
        </v-col>
      </v-row>

      <!-- Enter the shell — below the message, where it was -->
      <v-row class="mb-15">
        <v-col cols="12">
          <v-btn
            @click="handleEnterMerc"
            size="x-large"
            block
            rounded="pill"
            variant="flat"
            append-icon="mdi-arrow-right"
            class="merc-enter-btn"
          >
            Enter Merc
          </v-btn>
        </v-col>
      </v-row>



      <!-- Live activity ticker -->
      <v-row class="mb-5">
        <v-col cols="12">
          <merc-live-ticker />
        </v-col>
      </v-row>

      <!-- Headline stats -->
      <v-row class="mt-2">
        <v-col v-for="stat in stats" :key="stat.label" cols="6" sm="3">
          <v-card variant="outlined" rounded="lg" class="merc-stat-card fill-height pa-3">
            <span class="d-block">
              <span v-if="stat.value.startsWith('$')" class="text-body-2 text-medium-emphasis">$</span>
              <span class="text-h6 font-weight-bold">{{ stat.value.replace(/^\$/, '') }}</span>
            </span>
            <span class="d-block text-caption text-medium-emphasis mt-1">{{ stat.label }}</span>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
import { useRouter } from 'vue-router'
import MercLiveTicker from '@/components/merc/MercLiveTicker.vue'
import MercListingFlow from '@/components/merc/MercListingFlow.vue'
import { MERC_LANDING_STATS } from '@/mocks/mockLandingFeed'
import { MERC_BASE_PATH } from '@/configs/mercDefaults'

const router = useRouter()
const stats = MERC_LANDING_STATS

function handleEnterMerc() {
  router.push(`${MERC_BASE_PATH}/app`)
}
</script>

<style scoped>
/* Muted card border — dimmer than the default outlined white. */
.merc-stat-card {
  border-color: rgba(255, 255, 255, 0.18) !important;
}

/* Finished CTA: teal gradient pill with a soft glow + hover lift. !important overrides
   Vuetify's default button background/shadow. */
.merc-enter-btn {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
  color: #fff !important;
  text-transform: none;
  letter-spacing: 0.03em;
  font-weight: 700;
  min-height: 60px;
  box-shadow: 0 6px 20px rgba(20, 184, 166, 0.35) !important;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.merc-enter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(20, 184, 166, 0.45) !important;
}
</style>
