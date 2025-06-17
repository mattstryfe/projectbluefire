<template>
  <v-row class="flex-0-1 mb-4">
    <v-col class="text-center mt-5">
      <h1 class="text-h1 mb-4">
        Project
        <span class="text-blue-lighten-1 burning-blue-fire-intense">
          Bluefire
        </span>
      </h1>
      <span class="text-amber-darken-2">{{ missionStatement }}</span>
    </v-col>
  </v-row>

  <v-row>
    <v-col class="mx-auto my-0 pt-0" cols="5">
      <v-divider class="mt-2 mx-4" color="blue" :thickness="3"></v-divider>
    </v-col>
  </v-row>

  <v-row class="mt-6 px-2">
    <landing-page-card
      v-for="card in cards"
      :key="card"
      :card="card"
    ></landing-page-card>
  </v-row>
</template>

<script setup>
import { computed, ref } from 'vue'
import LandingPageCard from '@/components/navigation/LandingPageCard.vue'
import { routes } from '@/schemas/routerLinksSchema'

const missionStatement = ref(
  'An attempt to improve everything; beginning with weather.'
)
const cards = computed(() => routes.filter((l) => !l.hideInMainNav))
</script>

<style scoped>
.burning-blue-fire-intense {
  animation: blueFireIntense 5s ease-in-out infinite;
}

@keyframes blueFireIntense {
  0% {
    color: #90caf9; /* Very light blue */
    filter: drop-shadow(0 0 2px rgba(144, 202, 249, 0.5));
    transform: scale(1);
  }
  50% {
    color: #2196f3; /* Medium blue */
    filter: drop-shadow(0 0 10px rgba(33, 150, 243, 0.8));
    transform: scale(1.1);
  }
  100% {
    color: #90caf9; /* Very light blue */
    filter: drop-shadow(0 0 2px rgba(144, 202, 249, 0.5));
    transform: scale(1);
  }
}
</style>
