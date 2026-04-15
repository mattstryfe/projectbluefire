<template>
  <!-- feature card area to focus on TODAY -->
  <!-- TODO: TG-50 - add skeleton loaders -->
  <template v-for="(day, index) in dailyForecastData" :key="day.date">
    <forecast-card-featured v-if="index === 0" :day="day" />
    <forecast-card v-else :day="day" />
  </template>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'
import ForecastCard from '@/components/jtw/ForecastCard.vue'
import ForecastCardFeatured from '@/components/jtw/ForecastCardFeatured.vue'

const { dailyForecastData } = storeToRefs(useWeatherDataStore())
</script>

<style scoped></style>
