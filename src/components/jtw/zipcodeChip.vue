<template>
  <v-chip-group v-model="selectedZipcode">
    <v-chip
      v-for="location in savedLocations"
      :key="location.zipcode"
      :value="location.zipcode"
      closable
      @click:close="removeLocationFromLocalStorage(location.zipcode)"
      variant="outlined"
      color="grey"
      border="sm"
    >
      {{ location.zipcode }}
    </v-chip>
  </v-chip-group>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore.js'
import { ref } from 'vue'

const selectedZipcode = ref()
const { removeLocationFromLocalStorage } = useUserStore()
const { savedLocations } = storeToRefs(useUserStore())
</script>

<style scoped></style>
