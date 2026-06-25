<template>
  <v-card class="merc-sheet" rounded="t-xl">
    <v-sheet color="surface-variant" rounded="pill" width="40" height="4" class="mx-auto mt-2 mb-1" />

    <v-card-title class="d-flex align-center">
      Post a showing
      <v-spacer />
      <v-btn @click="emit('close')" icon="mdi-close" variant="text" size="small" />
    </v-card-title>

    <v-card-text>
      <v-btn-toggle v-model="source" color="primary" variant="outlined" divided mandatory class="mb-4 d-flex">
        <v-btn value="listing" class="flex-grow-1" prepend-icon="mdi-format-list-bulleted">
          From my listings
        </v-btn>
        <v-btn value="pin" class="flex-grow-1" prepend-icon="mdi-map-marker-plus">
          Drop a pin
        </v-btn>
      </v-btn-toggle>

      <v-text-field
        v-model="address"
        label="Property address"
        prepend-inner-icon="mdi-home-outline"
        variant="outlined"
        density="comfortable"
      />

      <v-row no-gutters class="ga-3">
        <v-col>
          <v-text-field
            v-model="date"
            label="Date"
            type="date"
            prepend-inner-icon="mdi-calendar"
            variant="outlined"
            density="comfortable"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="time"
            label="Time"
            type="time"
            prepend-inner-icon="mdi-clock-outline"
            variant="outlined"
            density="comfortable"
          />
        </v-col>
      </v-row>

      <v-text-field
        v-model="payout"
        label="Payout"
        type="number"
        prefix="$"
        prepend-inner-icon="mdi-cash"
        variant="outlined"
        density="comfortable"
        hint="Virtual money in Phase 1"
        persistent-hint
      />
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-btn @click="post" color="secondary" variant="flat" block size="large">
        Post showing
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore.js'

const emit = defineEmits(['close'])

const source = ref('listing')
const address = ref('')
const date = ref('')
const time = ref('')
const payout = ref(null)

function post() {
  // Submission is scaffolding only — the create flow + ledger writes arrive in a later ticket.
  const { addNotification } = useNotificationStore()
  addNotification({
    message: 'Posting goes live in a later ticket — this is the shell only.',
    color: 'info',
    icon: 'mdi-information-outline',
    timeout: 4000
  })
  emit('close')
}
</script>
