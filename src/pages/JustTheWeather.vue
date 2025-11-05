<template>
  <v-row>
    <v-alert density="compact" variant="outlined" color="info" v-if="isLoading">
      <v-icon size="large">mdi-information-slab-circle-outline</v-icon>
      <span class="pl-2">Getting location information...</span>
    </v-alert>
  </v-row>
  <v-row>
    <v-col></v-col>
    <v-col class="d-flex align-center justify-center">
      <v-btn
        icon
        variant="text"
        size="75"
        @click="useUserStore().getUserLocation()"
      >
        <v-icon color="info" size="75" :class="{ rotating: isLoading }">
          {{ isLoading ? 'mdi-target' : 'mdi-target-account' }}
        </v-icon>
      </v-btn>
    </v-col>
    <v-col></v-col>
  </v-row>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const { isLoading } = storeToRefs(useUserStore())

onMounted(() => {
  useUserStore().getUserLocation()
})
</script>

<style scoped>
.rotating {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
