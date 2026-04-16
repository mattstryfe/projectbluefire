<template>
  <!-- skeleton loaders while forecast is fetching (TG-50) -->
  <template v-if="isLoadingForecast">
    <forecast-card-featured-skeleton />
    <forecast-card-skeleton v-for="n in 6" :key="n" />
  </template>

  <!-- feature card area to focus on TODAY -->
  <template v-else v-for="(day, index) in dailyForecastData" :key="day.date">
    <forecast-card-featured v-if="index === 0" :day="day" />
    <forecast-card v-else :day="day" />
  </template>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'
import ForecastCard from '@/components/jtw/ForecastCards/ForecastCard.vue'
import ForecastCardFeatured from '@/components/jtw/ForecastCards/ForecastCardFeatured.vue'
import ForecastCardSkeleton from '@/components/jtw/ForecastCards/ForecastCardSkeleton.vue'
import ForecastCardFeaturedSkeleton from '@/components/jtw/ForecastCards/ForecastCardFeaturedSkeleton.vue'

const { dailyForecastData, isLoadingForecast } = storeToRefs(useWeatherDataStore())
</script>

<style scoped></style>
