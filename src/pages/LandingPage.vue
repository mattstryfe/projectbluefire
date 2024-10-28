<template>
  <v-row class="text-center mb-5">
    <v-col>
      <h1 class="text-h1 mb-4">
        Project
        <span class="text-blue-lighten-1">Bluefire</span>
      </h1>
      <span class="text-amber-darken-2">{{ missionStatement }}</span>
    </v-col>
  </v-row>

  <v-divider></v-divider>

  <v-row no-gutters>


  </v-row>
</template>

<script setup>
import { ref } from 'vue'

const missionStatement = ref(
  'An attempt to improve everything; beginning with weather.'
)
</script>

<style scoped>
.burning-fire {
  animation: colorShift 2s infinite alternate;
}

@keyframes colorShift {
  0% {
    color: #4196ff; /* Light blue */
  }
  50% {
    color: #9c27b0; /* Purple - transitional color */
  }
  100% {
    color: #ff1744; /* Red */
  }
}


</style>
