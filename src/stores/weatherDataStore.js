import { defineStore } from 'pinia'
import { getWeatherUrlsForThisZipcode } from '@/services/googleServices.js'
import { useUserStore } from '@/stores/userStore.js'
import { useNotificationStore } from '@/stores/notificationStore.js'
import { buildDailyDataFromHourly, processNWSGridData } from '@/utils/weatherUtils.js'
import { fetchEnrichedPrecipByDay, parseOpenMeteoPrecip } from '@/services/openMeteoService.js'
import { computed, ref } from 'vue'
import mockGridData from '@/mocks/rawGridRes.json'
import mockHourlyData from '@/mocks/rawForecastHourly.json'
import mockOpenMeteoData from '@/mocks/rawOpenMeteoPrecip.json'

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
    hourly: [],          // raw periods[] from NWS forecastHourly — drives daily cards
    enrichedPrecip: []   // per-day totals from Open-Meteo; [] when detailedPrecipitation is OFF
  })
  const forecastUrls = ref()
  const isLoadingForecast = ref(false)
  const isEnrichedPrecipLoading = ref(false)
  // TODO: TG-74: rename → locationUsedInForecast, shape to LocationRecord
  const zipcodeUsedInForecast = ref(null)
  // TODO: TG-74: rename → locationInputValue, shape to LocationRecord { placeId, displayLabel, lat, lng, ... }
  const zipcodeTextFieldValue = ref()

  // Abort controller
  let weatherAbortController = null

  // Computeds
  // TODO: TG-74: replace with lat/lng equality check — Places provides coords directly, no zipcode comparison needed
  const coordsMatchZip = computed(
    () => useUserStore().userGeoCoords?.zipcode === zipcodeTextFieldValue.value
  )

  const dailyForecastData = computed(() => {
    if (forecastData.value.hourly.length) {
      return buildDailyDataFromHourly(
        forecastData.value.hourly,
        forecastData.value.raw.quantitativePrecipitation,
        forecastData.value.enrichedPrecip
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
      forecastData.value.enrichedPrecip = parseOpenMeteoPrecip(mockOpenMeteoData)
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
      // TODO: TG-74: bypass for Places flow — lat/lng already known from Place Details response
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
      const [rawGridData, rawHourlyData] = await Promise.all([gridRes.json(), hourlyRes.json()])

      forecastData.value.raw = processNWSGridData(rawGridData)
      forecastData.value.hourly = rawHourlyData.properties.periods

      // Always fetch Open-Meteo enrichment — fire-and-forget so it never delays
      // the primary forecast notification. The toggle controls display only.
      forecastData.value.enrichedPrecip = []
      isEnrichedPrecipLoading.value = true
      fetchEnrichedPrecipByDay(lat, lng, signal)
        .then((enriched) => { forecastData.value.enrichedPrecip = enriched })
        .catch((err) => {
          if (err.name !== 'AbortError') console.warn('Open-Meteo enrichment failed:', err)
        })
        .finally(() => { isEnrichedPrecipLoading.value = false })

      console.log('forecastData.value', forecastData.value)

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
    isEnrichedPrecipLoading,
    forecastData,
    dailyForecastData,
    zipcodeUsedInForecast,
    zipcodeTextFieldValue,
    getWeatherForecastForThisZipcode
  }
})
