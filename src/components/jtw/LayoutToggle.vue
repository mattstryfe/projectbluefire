<template>
  <v-col cols="auto">
    <v-btn-toggle
      v-model="jtwViewChoice"
      mandatory
      group
      rounded="5"
      divided
      border
      density="compact"
    >
      <v-btn value="card">
        <v-icon>
          mdi-card-multiple
        </v-icon>
      </v-btn>

      <v-btn value="chart">
        <v-icon>
          mdi-chart-bar
        </v-icon>
      </v-btn>
    </v-btn-toggle>
  </v-col>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore.js'

const { jtwViewChoice } = storeToRefs(useUserStore())
</script>

<style scoped></style>
