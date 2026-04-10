<template>
  <v-container>
    <!-- feature card area to focus on TODAY -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            {{ featureDay }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
import { computed } from 'vue'

const { dailyForecastData } = storeToRefs(useWeatherDataStore())
const featureDay = computed(() => ({
  low: dailyForecastData.value[0]?.daily.low
}))
</script>

<style scoped></style>
