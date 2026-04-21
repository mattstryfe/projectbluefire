<template>
  <!-- skeleton loaders while forecast is fetching (TG-50) -->
  <template v-if="forecastCardsState === 'loading'">
    <forecast-card-featured-skeleton />
    <forecast-card-skeleton v-for="n in 6" :key="n" />
  </template>

  <!-- empty state before any forecast is loaded -->
  <forecast-cards-empty v-else-if="forecastCardsState === 'empty'" />

  <!-- feature card area to focus on TODAY -->
  <template v-else>
    <template v-for="(day, index) in dailyForecastData" :key="day.date">
      <forecast-card-featured v-if="index === 0" :day="day" />
      <forecast-card v-else :day="day" />
    </template>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'
import ForecastCard from '@/components/jtw/ForecastCards/ForecastCard.vue'
import ForecastCardFeatured from '@/components/jtw/ForecastCards/ForecastCardFeatured.vue'
import ForecastCardSkeleton from '@/components/jtw/ForecastCards/ForecastCardSkeleton.vue'
import ForecastCardFeaturedSkeleton from '@/components/jtw/ForecastCards/ForecastCardFeaturedSkeleton.vue'
import ForecastCardsEmpty from '@/components/jtw/ForecastCards/ForecastCardsEmpty.vue'

const { dailyForecastData, isLoadingForecast } = storeToRefs(
  useWeatherDataStore()
)

const forecastCardsState = computed(() => {
  if (isLoadingForecast.value) return 'loading'
  if (!dailyForecastData.value) return 'empty'
  return 'data'
})
</script>

<style scoped></style>
