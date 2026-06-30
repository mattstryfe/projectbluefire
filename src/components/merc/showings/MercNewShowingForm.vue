<template>
  <!-- "New showing": manual entry. Owns one reactive `form` model + submit; the actual write lives
       in mercShowingsStore.postShowing (components stay thin). `prefill` is called by the wrapper
       when a saved listing is picked. -->
  <v-form ref="showingFormRef" @submit.prevent="post" class="pt-2">
    <v-text-field
      v-model="form.address"
      @update:model-value="form.coords = null"
      :rules="[required]"
      label="Property address"
      prepend-inner-icon="mdi-home-outline"
      variant="outlined"
      density="comfortable"
    >
      <template #append-inner>
        <v-progress-circular v-if="mercShowingsStore.isGettingLocation" indeterminate size="20" width="2" color="primary" />
        <!-- @mousedown.prevent keeps the click from focusing the address field, so the mobile
             keyboard doesn't pop up and cover the location toasts; the click still fires. -->
        <v-icon
          v-else
          @mousedown.prevent
          @click="useCurrentLocation"
          icon="mdi-crosshairs-gps"
          color="primary"
          title="Use current location"
          style="cursor: pointer"
        />
      </template>
    </v-text-field>

    <v-text-field
      v-model="form.client.name"
      :rules="[required]"
      label="Client name"
      prepend-inner-icon="mdi-account-outline"
      variant="outlined"
      density="comfortable"
    />

    <v-text-field
      v-model="form.client.email"
      :rules="[required, validEmail]"
      label="Client email"
      type="email"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      density="comfortable"
    />

    <v-text-field
      v-model="form.client.phone"
      :rules="[required]"
      label="Client phone"
      type="tel"
      prepend-inner-icon="mdi-phone-outline"
      variant="outlined"
      density="comfortable"
    />

    <v-row no-gutters class="ga-3">
      <v-col>
        <v-text-field
          v-model="form.showingDate"
          :rules="[required]"
          label="Date"
          type="date"
          variant="outlined"
          density="comfortable"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="form.showingTime"
          :rules="[required]"
          label="Time"
          type="time"
          variant="outlined"
          density="comfortable"
        />
      </v-col>
    </v-row>

    <v-text-field
      v-model="form.payout"
      :rules="[required, nonNegative]"
      label="Payout"
      type="number"
      prefix="$"
      prepend-inner-icon="mdi-cash"
      variant="outlined"
      density="comfortable"
      hint="Virtual money in Phase 1"
      persistent-hint
    />
  </v-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { useMercAuthStore } from '@/stores/mercAuthStore.js'
import { useMercShowingsStore } from '@/stores/mercShowingsStore.js'
import { useNotificationStore } from '@/stores/notificationStore.js'
import { MERC_SHOWING_LEAD_HOURS } from '@/configs/mercDefaults'

const emit = defineEmits(['close'])

const mercAuthStore = useMercAuthStore()
const mercShowingsStore = useMercShowingsStore()

// One reactive model instead of a fistful of refs — prefill / clear / submit all operate on a
// single shape. showingDate defaults to today and showingTime to ~1h out (dayjs), recomputed each
// time the form is created/reset. `sample: true` seeds dev-only test values to speed up test entry
// (first open in dev only); Clear passes nothing, so it wipes to a truly empty form.
function blankShowingForm({ sample = false } = {}) {
  return {
    address: sample ? '1750 Tysons Blvd, McLean, VA 22102' : '',
    coords: null,
    client: {
      name: sample ? 'Jamie Rivera' : '',
      email: sample ? 'jamie.rivera@example.com' : '',
      phone: sample ? '703-555-0167' : ''
    },
    showingDate: dayjs().format('YYYY-MM-DD'),
    showingTime: dayjs().add(MERC_SHOWING_LEAD_HOURS, 'hour').format('HH:mm'),
    payout: sample ? 250 : null
  }
}

// The real demo form ships blank; seed sample values on first open in dev only.
const form = reactive(blankShowingForm({ sample: import.meta.env.DEV }))
const showingFormRef = ref(null)

const required = (v) => (!!v && String(v).trim().length > 0) || 'Required'
const validEmail = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) || 'Enter a valid email'
const nonNegative = (v) => Number(v) >= 0 || 'Must be 0 or more'

function notify(opts) {
  useNotificationStore().addNotification(opts)
}

// Pre-fill the form from a saved client (called by the wrapper after a listing is picked).
function prefill(savedListing) {
  form.address = savedListing.address
  form.coords = savedListing.coords ?? null
  form.client.name = savedListing.client.name
  form.client.email = savedListing.client.email
  form.client.phone = savedListing.client.phone
}

// Reset the whole model in one shot (showingDate/showingTime return to their fresh defaults).
function clearForm() {
  Object.assign(form, blankShowingForm())
  showingFormRef.value?.resetValidation()
}

// Delegate the geolocation + reverse-geocode to the store; just apply the result to the model.
async function useCurrentLocation() {
  const { ok, coords, address } = await mercShowingsStore.getCurrentLocation()
  if (!ok) return
  form.coords = coords
  if (address) form.address = address
}

async function post() {
  // Browse is open to all, but posting requires a Merc session (block + toast).
  if (!mercAuthStore.userIsAuthenticated) {
    notify({ message: 'Sign in to Merc to post a showing.', color: 'warning', icon: 'mdi-account-alert-outline', timeout: 5000 })
    return
  }

  const { valid } = await showingFormRef.value.validate()
  if (!valid) return

  const result = await mercShowingsStore.postShowing({
    address: form.address.trim(),
    coords: form.coords,
    client: {
      name: form.client.name.trim(),
      email: form.client.email.trim(),
      phone: form.client.phone.trim()
    },
    // Merge the separate date + time inputs into one scheduledAt instant.
    scheduledAt: new Date(`${form.showingDate}T${form.showingTime}`),
    allocation: Number(form.payout)
  })

  if (result.ok) emit('close')
}

// The wrapper drives the form via its ref: prefill() on a picked listing, clearForm()/post() from
// the pinned footer buttons it owns.
defineExpose({ prefill, clearForm, post })
</script>
