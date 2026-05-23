import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore.js'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'
import { PRECIP_TOTAL_THRESHOLD } from '@/config/appDefaults.js'

/**
 * Centralizes precipitation display logic shared between ForecastCard and ForecastCardFeatured.
 *
 * @param {import('vue').Ref} dayRef - A ref wrapping the daily forecast day object
 */
export function usePrecipDisplay(dayRef) {
  const { detailedPrecipitation } = storeToRefs(useUserStore())
  const { isEnrichedPrecipLoading } = storeToRefs(useWeatherDataStore())

  // The value that should be displayed — null while enriched is loading (toggle ON)
  // so NWS never flashes in before Open-Meteo resolves
  const activePrecip = computed(() => {
    if (detailedPrecipitation.value) {
      if (isEnrichedPrecipLoading.value) return null
      return dayRef.value.daily.precipTotalEnriched ?? dayRef.value.daily.precipTotal
    }
    return dayRef.value.daily.precipTotal
  })

  const precipIconColor = computed(() =>
    activePrecip.value > PRECIP_TOTAL_THRESHOLD ? 'blue-lighten-2' : 'grey'
  )

  const precipDisplay = computed(() =>
    activePrecip.value > 0 ? `${activePrecip.value}"` : '--'
  )

  // Only show divergence when NWS has a real non-zero value — NWS covers fewer days
  // so later days always show 0, which would create false divergence noise
  const hasDivergence = computed(() =>
    dayRef.value.daily.precipTotalEnriched != null &&
    dayRef.value.daily.precipTotal > 0 &&
    dayRef.value.daily.precipTotalEnriched !== dayRef.value.daily.precipTotal
  )

  // Label for the tooltip showing the value NOT currently being displayed
  const otherPrecipLabel = computed(() =>
    detailedPrecipitation.value
      ? `NWS: ${dayRef.value.daily.precipTotal}"`
      : `Open-Meteo: ${dayRef.value.daily.precipTotalEnriched}"`
  )

  return { activePrecip, precipIconColor, precipDisplay, hasDivergence, otherPrecipLabel }
}
