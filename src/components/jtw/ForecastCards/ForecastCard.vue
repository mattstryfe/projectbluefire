<template>
  <!-- hide cards using nasty v-if for now until we clear the data further upstream -->
  <v-col v-if="day.daily.high" cols="2">
    <v-card class="text-center text-medium-emphasis" border>
      <div class="text-label-small border-b mb-1">{{ day.label }}</div>
      <div class="text-title-large">{{ day.daily.high }}&deg;</div>
      <div class="text-label-medium">{{ day.daily.low }}&deg;</div>
      <v-icon class="my-1">mdi-cloud</v-icon>
      <div>{{ day.daily.probabilityOfPrecipitation }}%</div>
    </v-card>
  </v-col>
</template>

<script setup>
const props = defineProps({
  day: {
    type: Object,
    required: true
  }
})
</script>

<style scoped></style>
