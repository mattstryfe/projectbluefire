import { defineStore } from 'pinia'
import { getWeatherUrlsForThisZipcode } from '@/services/googleServices.js'
import { useUserStore } from '@/stores/userStore.js'
import {
  processNWSGridData,
  processPrecipitationByDay
} from '@/utils/weatherUtils.js'
import { ref } from 'vue'

export const useWeatherDataStore = defineStore('weatherDataStore', () => {
  const forecastData = ref({
    raw: {
      temperature: [],
      humidity: [],
      windSpeed: [],
      apparentTemperature: [],
      quantitativePrecipitation: []
    },
    parsed: {
      precipitation: []
    }
  })
  const forecastUrls = ref()
  const isLoadingForecast = ref(false)
  const zipcodeUsedInForecast = ref(null)
  const zipcodeTextFieldValue = ref()

  // Abort controller
  let weatherAbortController = null

  // Actions
  async function getWeatherForecastForThisZipcode() {
    // Abort any in-flight request
    if (weatherAbortController) {
      weatherAbortController.abort()
    }

    // Create new controller for this request
    weatherAbortController = new AbortController()
    const { signal } = weatherAbortController

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

      forecastUrls.value = await getWeatherUrlsForThisZipcode(lat, lng, signal)

      const gridRes = await fetch(forecastUrls.value.gridData, { signal })
      const rawGridForecastData = await gridRes.json()
      console.log('raw weather response', rawGridForecastData.properties)

      forecastData.value.raw = processNWSGridData(rawGridForecastData)
      // putting this here for now
      forecastData.value.parsed.precipitation = processPrecipitationByDay(
        rawGridForecastData.properties.quantitativePrecipitation.values
      )
      console.log('forecastData: processed', forecastData.value)
    } catch (error) {
      // Handle both AbortError and DOMException (some browsers)
      if (error.name === 'AbortError' || signal.aborted) {
        return
      }
      console.error(error)
    } finally {
      isLoadingForecast.value = false
      weatherAbortController = null
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
