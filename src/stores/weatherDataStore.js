import { defineStore } from 'pinia'
import { getWeatherUrlsForThisZipcode } from '@/services/googleServices.js'
import { useUserStore } from '@/stores/userStore.js'
import { useNotificationStore } from '@/stores/notificationStore.js'
import { buildDailyDataFromHourly, processNWSGridData } from '@/utils/weatherUtils.js'
import { computed, ref } from 'vue'
import mockGridData from '@/mocks/rawGridRes.json'
import mockHourlyData from '@/mocks/rawForecastHourly.json'

export const useWeatherDataStore = defineStore('weatherDataStore', () => {
  const forecastData = ref({
    raw: {
      temperature: [],
      humidity: [],
      windSpeed: [],
      apparentTemperature: [],
      quantitativePrecipitation: [],
      probabilityOfPrecipitation: []
    },
    hourly: []  // raw periods[] from NWS forecastHourly — drives daily cards
  })
  const forecastUrls = ref()
  const isLoadingForecast = ref(false)
  const zipcodeUsedInForecast = ref(null)
  const zipcodeTextFieldValue = ref()

  // Abort controller
  let weatherAbortController = null

  // Computeds
  const coordsMatchZip = computed(
    () => useUserStore().userGeoCoords?.zipcode === zipcodeTextFieldValue.value
  )

  const dailyForecastData = computed(() => {
    if (forecastData.value.hourly.length) {
      return buildDailyDataFromHourly(
        forecastData.value.hourly,
        forecastData.value.raw.quantitativePrecipitation
      )
    }
    return []
  })

  // Actions
  async function getWeatherForecastForThisZipcode(useMockData = false) {
    if (useMockData) {
      const delay = Number(import.meta.env.VITE_MOCK_WEATHER_DELAY_MS)
      if (delay > 0) {
        isLoadingForecast.value = true
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
      forecastData.value.raw = processNWSGridData(mockGridData)
      forecastData.value.hourly = mockHourlyData.properties.periods
      isLoadingForecast.value = false
      return
    }

    zipcodeUsedInForecast.value = null

    if (weatherAbortController) {
      weatherAbortController.abort()
    }

    weatherAbortController = new AbortController()
    const { signal } = weatherAbortController
    const { addNotification, removeNotification } = useNotificationStore()
    const loadingId = addNotification({
      message: 'Fetching forecast...',
      color: 'info',
      icon: 'mdi-weather-partly-cloudy',
      timeout: null
    })

    isLoadingForecast.value = true
    if (!coordsMatchZip.value) {
      await useUserStore().getUserLocationUsingManualZipcode(zipcodeTextFieldValue.value)
    }

    try {
      zipcodeUsedInForecast.value = zipcodeTextFieldValue.value
      const { lat, lng } = useUserStore().userGeoCoords

      forecastUrls.value = await getWeatherUrlsForThisZipcode(lat, lng, signal)
      console.log('forecastUrls.value', forecastUrls.value)

      // TODO: TG-70: swap gridData fetch → forecastHourly; remove processNWSGridData call
      const [gridRes, hourlyRes] = await Promise.all([
        fetch(forecastUrls.value.gridData, { signal }),
        fetch(forecastUrls.value.forecastHourly, { signal })
      ])
      const [rawGridData, rawHourlyData] = await Promise.all([
        gridRes.json(),
        hourlyRes.json()
      ])

      forecastData.value.raw = processNWSGridData(rawGridData)
      forecastData.value.hourly = rawHourlyData.properties.periods

      removeNotification(loadingId)
      addNotification({
        message: `Forecast loaded for ${zipcodeTextFieldValue.value}`,
        color: 'success',
        icon: 'mdi-check-circle-outline',
        timeout: 4000
      })
    } catch (error) {
      removeNotification(loadingId)
      if (error.name === 'AbortError' || signal.aborted) {
        return
      }
      useUserStore().failedZipcodes.add(zipcodeTextFieldValue.value)
      addNotification({
        message: `Could not load forecast for ${zipcodeTextFieldValue.value}`,
        color: 'error',
        icon: 'mdi-alert-circle-outline',
        timeout: 5000
      })
      console.error(error)
    } finally {
      isLoadingForecast.value = false
      weatherAbortController = null
    }
  }

  return {
    isLoadingForecast,
    forecastData,
    dailyForecastData,
    zipcodeUsedInForecast,
    zipcodeTextFieldValue,
    getWeatherForecastForThisZipcode
  }
})
