<template>
  <v-col cols="7">
    <v-card class="text-center" border>
      <div class="text-label-small border-b mb-1">Now</div>

      <v-card-item>
        <v-card-title class="text-display-large">
          {{ currentTemperature }}&deg;
        </v-card-title>
        <v-card-subtitle>feels like...</v-card-subtitle>
        <v-card-subtitle>high: {{ day.daily.high }}&deg;</v-card-subtitle>
        <v-card-subtitle>low: {{ day.daily.low }}&deg;</v-card-subtitle>
      </v-card-item>
      <v-card-item></v-card-item>
    </v-card>
  </v-col>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  day: {
    type: Object,
    required: true
  }
})

const currentTemperature = computed(() => props.day.hourly.temperature[0].value)
console.log('day', props.day)
</script>

<style scoped></style>
