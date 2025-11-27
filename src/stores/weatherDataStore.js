import { defineStore } from 'pinia'
import { getWeatherUrlsForThisZipcode } from '@/services/googleServices.js'
import { useUserStore } from '@/stores/userStore.js'
import { processNWSTemperatureData } from '@/utils/weatherUtils.js'
import { ref } from 'vue'

export const useWeatherDataStore = defineStore('weatherDataStore', () => {
  const temperatureData = ref([])
  const forecastUrls = ref()
  const isLoadingForecast = ref(false)
  const zipcodeUsedInForecast = ref(null)

  // Actions
  async function getWeatherForecastForThisZipcode(zipcodeEnteredByUser) {
    isLoadingForecast.value = true
    try {
      zipcodeUsedInForecast.value = zipcodeEnteredByUser
      const { lat, lng } =
        await useUserStore().getUserLocationUsingManualZipcode(
          zipcodeEnteredByUser.value
        )
      forecastUrls.value = await getWeatherUrlsForThisZipcode(lat, lng)

      const res = await fetch(forecastUrls.value.gridData)
      const rawGridForecastData = await res.json()

      temperatureData.value = processNWSTemperatureData(rawGridForecastData)
    } catch (error) {
      console.error(error)
    } finally {
      isLoadingForecast.value = false
    }
  }

  return {
    isLoadingForecast,
    temperatureData,
    zipcodeUsedInForecast,
    getWeatherForecastForThisZipcode
  }
})
