<template>
  <v-card class="merc-sheet" rounded="t-xl">
    <v-sheet color="surface-variant" rounded="pill" width="40" height="4" class="mx-auto mt-2 mb-1" />

    <v-card-title class="d-flex align-center">
      My showings
      <v-spacer />
      <v-btn @click="emit('close')" icon="mdi-close" variant="text" size="small" />
    </v-card-title>

    <v-tabs v-model="tab" color="primary" density="compact" grow>
      <v-tab value="open">
        Open
      </v-tab>
      <v-tab value="claimed">
        Claimed
      </v-tab>
      <v-tab value="completed">
        Completed
      </v-tab>
    </v-tabs>

    <v-card-text class="px-0">
      <v-list lines="two">
        <v-list-item v-for="s in rows" :key="s.address" :title="s.address" :subtitle="s.meta">
          <template #prepend>
            <v-avatar rounded="lg" color="surface-variant">
              <v-icon color="medium-emphasis">
                mdi-home-city-outline
              </v-icon>
            </v-avatar>
          </template>
          <template #append>
            <v-chip size="small" color="primary" variant="tonal">
              ${{ s.payout }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
      <span class="d-block text-caption text-disabled text-center pb-3">Placeholder data · live in MER-17</span>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close'])
const tab = ref('open')

// Placeholder rows around the Hamilton (20158) market.
const rows = [
  { address: '112 W Colonial Hwy', meta: 'Hamilton · Today 3:30 PM', payout: 75 },
  { address: '38 N Maple Ave', meta: 'Purcellville · Today 5:00 PM', payout: 60 },
  { address: '210 Evening Star Dr', meta: 'Round Hill · Tomorrow 11:00 AM', payout: 95 }
]
</script>
