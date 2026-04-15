import { defineStore } from 'pinia'
import { getWeatherUrlsForThisZipcode } from '@/services/googleServices.js'
import { useUserStore } from '@/stores/userStore.js'
import { buildDailyData, processNWSGridData } from '@/utils/weatherUtils.js'
import { computed, ref } from 'vue'
import mockGridData from '@/mocks/rawGridRes.json'

export const useWeatherDataStore = defineStore('weatherDataStore', () => {
  const forecastData = ref({
    raw: {
      temperature: [],
      humidity: [],
      windSpeed: [],
      apparentTemperature: [],
      quantitativePrecipitation: [],
      probabilityOfPrecipitation: []
    }
  })
  const forecastUrls = ref()
  const isLoadingForecast = ref(false)
  const zipcodeUsedInForecast = ref(null)
  const zipcodeTextFieldValue = ref()

  // Abort controller
  let weatherAbortController = null

  // Computeds
  const dailyForecastData = computed(() => {
    if (forecastData.value.raw.temperature.length >= 1) {
      return buildDailyData(forecastData.value.raw)
    }
  })

  // Actions
  async function getWeatherForecastForThisZipcode(useMockData = false) {
    if (useMockData) {
      forecastData.value.raw = processNWSGridData(mockGridData)
      return
    }
    // Reset this (for display purposes only)
    zipcodeUsedInForecast.value = null

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

      forecastData.value.raw = processNWSGridData(rawGridForecastData)
      forecastDataSimple.value = processNWSGridData(rawGridForecastData)
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

  function clearForecast() {
    zipcodeTextFieldValue.value = ''
    zipcodeUsedInForecast.value = null
    forecastData.value = {
      raw: {
        temperature: [],
        humidity: [],
        windSpeed: [],
        apparentTemperature: [],
        quantitativePrecipitation: [],
        probabilityOfPrecipitation: []
      },
      parsed: {
        precipitation: []
      }
    }
  }

  return {
    isLoadingForecast,
    clearForecast,
    forecastData,
    dailyForecastData,
    zipcodeUsedInForecast,
    zipcodeTextFieldValue,
    getWeatherForecastForThisZipcode
  }
})
