<template>
  <v-col cols="7">
    <v-card class="text-center" border>
      <div class="text-label-small border-b mb-1">
        Now
      </div>

      <v-card-item>
        <v-card-title class="text-display-large ms-2">
          {{ currentTemperature }}&deg;
        </v-card-title>
        <v-card-subtitle>
          feels like... {{ currentApparentTemperature }}&deg;
        </v-card-subtitle>
        <v-card-subtitle>
          high: {{ day.daily.high }}&deg;
        </v-card-subtitle>
        <v-card-subtitle>
          low: {{ day.daily.low }}&deg;
        </v-card-subtitle>
      </v-card-item>
      <v-card-item></v-card-item>
    </v-card>
  </v-col>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  day: {
    type: Object,
    required: true
  }
})

// Returns the most recent hourly value that has already started,
// handling multi-hour NWS intervals (PT2H, PT3H, etc.)
function getCurrentValue(entries) {
  const now = dayjs()
  return entries.findLast((entry) => !dayjs(entry.timestamp).isAfter(now))?.value ?? null
}

const currentTemperature = computed(() => getCurrentValue(props.day.hourly.temperature))
const currentApparentTemperature = computed(() =>
  getCurrentValue(props.day.hourly.apparentTemperature)
)
</script>

<style scoped></style>
