import { defineStore } from 'pinia'
import { getWeatherUrlsForThisZipcode } from '@/services/googleServices.js'
import { useUserStore } from '@/stores/userStore.js'
import { processNWSGridData } from '@/utils/weatherUtils.js'
import { ref } from 'vue'

export const useWeatherDataStore = defineStore('weatherDataStore', () => {
  const forecastData = ref({
    temperature: [],
    humidity: [],
    windSpeed: [],
    apparentTemperature: [],
    quantitativePrecipitation: []
  })
  const forecastUrls = ref()
  const isLoadingForecast = ref(false)
  const zipcodeUsedInForecast = ref(null)
  const zipcodeTextFieldValue = ref()

  // Actions
  async function getWeatherForecastForThisZipcode() {
    isLoadingForecast.value = true
    // if the zipcode in the input box was changed by the user, reset userGeoCoords (auto from geoLoc)
    if (zipcodeTextFieldValue.value !== useUserStore().userGeoCoords?.zipcode) {
      await useUserStore().getUserLocationUsingManualZipcode(
        zipcodeTextFieldValue.value
      )
    }
    try {
      zipcodeUsedInForecast.value = zipcodeTextFieldValue.value
      const { lat, lng } = useUserStore().userGeoCoords

      forecastUrls.value = await getWeatherUrlsForThisZipcode(lat, lng)

      const res = await fetch(forecastUrls.value.gridData)
      const rawGridForecastData = await res.json()
      console.log('rawGridForecastData', rawGridForecastData)
      forecastData.value = processNWSGridData(rawGridForecastData)
    } catch (error) {
      console.error(error)
    } finally {
      isLoadingForecast.value = false
    }
  }

  return {
    isLoadingForecast,
    forecastData,
    zipcodeUsedInForecast,
    zipcodeTextFieldValue,
    getWeatherForecastForThisZipcode
  }
})
