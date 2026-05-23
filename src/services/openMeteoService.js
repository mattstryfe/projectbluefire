import dayjs from 'dayjs'

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast'
const MM_TO_INCHES = 0.0393701

/**
 * Fetches hourly precipitation from Open-Meteo for the given coords and
 * returns it bucketed by day as { date: 'YYYY-MM-DD', precipTotalEnriched: number }.
 *
 * Open-Meteo is free, no API key required, and returns data for a 7-day window
 * matching the NWS forecast range.
 *
 * @param {number} lat
 * @param {number} lng
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{ date: string, precipTotalEnriched: number }>>}
 */
export async function fetchEnrichedPrecipByDay(lat, lng, signal) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    hourly: 'precipitation',
    precipitation_unit: 'mm',
    forecast_days: 7,
    timezone: 'auto'
  })

  const res = await fetch(`${OPEN_METEO_BASE_URL}?${params}`, { signal })
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`)

  const json = await res.json()
  return parseOpenMeteoPrecip(json)
}

/**
 * Parses a raw Open-Meteo hourly response into per-day enriched precip totals.
 * Exported separately so the mock path can call it directly without a network request.
 *
 * @param {object} json  Raw Open-Meteo API response
 * @returns {Array<{ date: string, precipTotalEnriched: number }>}
 */
export function parseOpenMeteoPrecip(json) {
  const times = json.hourly?.time ?? []
  const values = json.hourly?.precipitation ?? []

  const byDay = {}

  for (let i = 0; i < times.length; i++) {
    const date = dayjs(times[i]).format('YYYY-MM-DD')
    const inches = (values[i] ?? 0) * MM_TO_INCHES
    byDay[date] = (byDay[date] ?? 0) + inches
  }

  return Object.entries(byDay).map(([date, total]) => ({
    date,
    precipTotalEnriched: Math.round(total * 100) / 100
  }))
}
