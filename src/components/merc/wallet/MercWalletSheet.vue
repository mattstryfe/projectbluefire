<template>
  <v-card class="merc-sheet" rounded="t-xl">
    <v-sheet color="surface-variant" rounded="pill" width="40" height="4" class="mx-auto mt-2 mb-1" />

    <v-card-title class="d-flex align-center">
      Wallet
      <v-spacer />
      <v-btn @click="emit('close')" icon="mdi-close" variant="text" size="small" />
    </v-card-title>

    <v-card-text>
      <v-card color="primary" variant="tonal" class="pa-4 mb-3">
        <span class="d-block text-caption text-medium-emphasis">Available balance</span>
        <span class="d-block text-h4 font-weight-bold">$1,240</span>
        <span class="d-block text-caption text-medium-emphasis mt-1">$310 pending in escrow</span>
      </v-card>

      <span class="text-overline text-medium-emphasis">Recent activity</span>
      <v-list lines="two" class="px-0">
        <v-list-item
          v-for="entry in entries"
          :key="entry.label"
          :title="entry.label"
          :subtitle="entry.when"
        >
          <template #prepend>
            <v-avatar :color="entry.amount > 0 ? 'success' : 'surface-variant'" size="36">
              <v-icon size="small">
                {{ entry.amount > 0 ? 'mdi-arrow-down' : 'mdi-arrow-up' }}
              </v-icon>
            </v-avatar>
          </template>
          <template #append>
            <span :class="entry.amount > 0 ? 'text-success' : 'text-medium-emphasis'">
              {{ entry.amount > 0 ? '+' : '' }}${{ Math.abs(entry.amount) }}
            </span>
          </template>
        </v-list-item>
      </v-list>
      <span class="d-block text-caption text-disabled text-center">Virtual balance · ledger-backed in a later ticket</span>
    </v-card-text>
  </v-card>
</template>

<script setup>
const emit = defineEmits(['close'])

// Placeholder ledger-style rows (append-only ledger lands later, ADR-002).
const entries = [
  { label: 'Settlement · Hamilton', when: 'Today', amount: 75 },
  { label: 'Allocation · Round Hill', when: 'Yesterday', amount: -95 },
  { label: 'Settlement · Leesburg', when: '2 days ago', amount: 120 }
]
</script>
