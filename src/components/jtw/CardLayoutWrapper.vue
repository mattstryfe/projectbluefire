<template>
  <v-container>
    <v-row>
      <v-col cols="3" v-for="day in dailyForecastData" :key="day.date">
        <v-card class="elevation-1" border>
          {{ day.daily.low }} / {{ day.daily.high }}
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <pre>
          {{ dailyForecastData }}
        </pre>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'

const { dailyForecastData } = storeToRefs(useWeatherDataStore())
</script>

<style scoped></style>
