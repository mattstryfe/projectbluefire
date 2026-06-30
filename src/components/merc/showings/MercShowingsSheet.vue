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
      <v-tab value="scheduled">
        Scheduled
      </v-tab>
      <v-tab value="completed">
        Completed
      </v-tab>
    </v-tabs>

    <v-card-text class="px-0">
      <v-list v-if="showingsForTab.length" lines="two">
        <v-list-item
          v-for="s in showingsForTab"
          :key="s.id"
          :title="s.property?.address ?? 'Unknown address'"
          :subtitle="rowMeta(s)"
        >
          <template #prepend>
            <v-avatar rounded="lg" color="surface-variant">
              <v-icon color="medium-emphasis">
                mdi-home-city-outline
              </v-icon>
            </v-avatar>
          </template>
          <template #append>
            <v-chip size="small" color="primary" variant="tonal">
              ${{ s.allocation ?? 0 }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
      <span v-else class="d-block text-caption text-disabled text-center py-8">{{ emptyLabel }}</span>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useMercShowingsStore } from '@/stores/mercShowingsStore'

const emit = defineEmits(['close'])
const mercShowingsStore = useMercShowingsStore()
const tab = ref('open')

// Sheet status groups → the showing statuses each tab includes. Scheduled = an agent is committed;
// Completed = done/settled. ("Claimed" renamed to "Scheduled" per the agreed tab model.)
const STATUS_GROUPS = {
  open: ['open'],
  scheduled: ['claimed', 'in_progress'],
  completed: ['completed', 'settled']
}

const EMPTY_LABELS = {
  open: 'No open showings yet.',
  scheduled: 'Nothing scheduled yet.',
  completed: 'No completed showings yet.'
}

const showingsForTab = computed(() => {
  const wanted = STATUS_GROUPS[tab.value] ?? []
  return mercShowingsStore.myShowings
    .filter((s) => wanted.includes(s.status))
    .sort((a, b) => dateMs(b.scheduledAt) - dateMs(a.scheduledAt))
})

const emptyLabel = computed(() => EMPTY_LABELS[tab.value] ?? 'Nothing here yet.')

// Firestore timestamps read back as a Timestamp ({seconds} / toDate()); normalize to a JS Date.
function tsToDate(ts) {
  if (!ts) return null
  if (typeof ts.toDate === 'function') return ts.toDate()
  if (typeof ts.seconds === 'number') return new Date(ts.seconds * 1000)
  return new Date(ts)
}
function dateMs(ts) {
  const d = tsToDate(ts)
  return d ? d.getTime() : 0
}
function rowMeta(s) {
  const d = tsToDate(s.scheduledAt)
  return d ? dayjs(d).format('ddd, MMM D · h:mm A') : '—'
}

// my-showings is driven by the store's auth watch (it re-subscribes on agent change), so the sheet
// just reads mercShowingsStore.myShowings — no per-open subscription lifecycle here.
</script>
