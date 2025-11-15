import { defineStore } from 'pinia'
import { getWeatherUrlsForThisZipcode } from '@/services/googleServices.js'
import { useUserStore } from '@/stores/userStore.js'

export const useWeatherDataStore = defineStore('weatherDataStore', () => {
  // Actions
  async function getWeatherForecastForThisZipcode(zipcodeEnteredByUser) {
    const { lat, lng } =
      await useUserStore().getUserLocationUsingManualZipcode(
        zipcodeEnteredByUser
      )
    const forecastUrls = await getWeatherUrlsForThisZipcode(lat, lng)
    console.log('forecastUrls', forecastUrls)
  }

  return {
    getWeatherForecastForThisZipcode
  }
})
