<template>
  <v-row class="flex-0-1 mb-4">
    <v-col class="mt-5 ml-2">
      <h1 class="text-h3 mb-2">Merc</h1>
      <span class="text-medium-emphasis">Real-estate showing coordination — module scaffold.</span>
    </v-col>
  </v-row>

  <v-row class="px-2">
    <v-col cols="12">
      <merc-placeholder />
    </v-col>
  </v-row>
</template>

<script setup>
import MercPlaceholder from '@/components/merc/MercPlaceholder.vue'
</script>
