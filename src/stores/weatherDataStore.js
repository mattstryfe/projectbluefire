import { defineStore } from 'pinia'
import { getWeatherUrlsForThisZipcode } from '@/services/googleServices.js'
import { useUserStore } from '@/stores/userStore.js'
import { processNWSTemperatureData } from '@/utils/weatherUtils.js'
import { ref } from 'vue'

export const useWeatherDataStore = defineStore('weatherDataStore', () => {
  const temperatureData = ref([])
  const forecastUrls = ref()
  // Actions
  async function getWeatherForecastForThisZipcode(zipcodeEnteredByUser) {
    const { lat, lng } =
      await useUserStore().getUserLocationUsingManualZipcode(
        zipcodeEnteredByUser
      )
    forecastUrls.value = await getWeatherUrlsForThisZipcode(lat, lng)

    const res = await fetch(forecastUrls.value.gridData)
    const rawGridForecastData = await res.json()

    temperatureData.value = processNWSTemperatureData(rawGridForecastData)
  }

  return {
    temperatureData,
    getWeatherForecastForThisZipcode
  }
})
