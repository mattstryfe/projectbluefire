<template>
  <!-- "From my listings": pick a saved client to pre-fill the New-showing form. Pure presentation —
       the chosen client bubbles up via `select` and the wrapper drives the prefill + tab switch. -->
  <v-list v-if="mockClients.length" lines="two" class="pt-1">
    <v-list-item
      v-for="client in mockClients"
      :key="client.id"
      @click="emit('select', client)"
      :title="client.client.name"
      :subtitle="client.address"
      prepend-icon="mdi-account-circle-outline"
      append-icon="mdi-chevron-right"
      rounded="lg"
      class="mb-1"
    />
  </v-list>
  <v-sheet v-else color="transparent" class="text-medium-emphasis text-center py-8">
    No clients yet.
  </v-sheet>
</template>

<script setup>
import { MERC_MOCK_CLIENTS } from '@/mocks/mercMockClients'

const emit = defineEmits(['select'])

const mockClients = MERC_MOCK_CLIENTS
</script>
