// Mapbox forward-geocoding for Merc (ADR-006). Best-effort: resolves a typed address to coords
// plus dedup hints, or returns null on any failure so callers can fall back (e.g. to the market
// center) without ever blocking a write (property-as-root, ADR-007). MER-20 adds the reverse
// (pin → address) counterpart.
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const GEOCODE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places'

/**
 * @param {string} query - a free-text address
 * @returns {Promise<{lat:number,lng:number,mapboxPlaceId:string|null,normalizedAddress:string|null}|null>}
 */
export async function geocodeAddress(query) {
  if (!query || !MAPBOX_TOKEN) return null
  try {
    const url = `${GEOCODE_URL}/${encodeURIComponent(query)}.json?limit=1&access_token=${MAPBOX_TOKEN}`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const feature = data?.features?.[0]
    if (!Array.isArray(feature?.center)) return null
    const [lng, lat] = feature.center
    return {
      lat,
      lng,
      mapboxPlaceId: feature.id ?? null,
      normalizedAddress: feature.place_name ?? null
    }
  } catch {
    // Network/parse failure is non-fatal — the caller falls back to the market center.
    return null
  }
}

/**
 * Reverse-geocode coordinates to a readable address (for the "Use current location" button).
 * Best-effort: returns null on any failure.
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<{address:string|null,mapboxPlaceId:string|null}|null>}
 */
export async function reverseGeocode(lat, lng) {
  if (!MAPBOX_TOKEN || lat == null || lng == null) return null
  try {
    const url = `${GEOCODE_URL}/${lng},${lat}.json?limit=1&access_token=${MAPBOX_TOKEN}`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const feature = data?.features?.[0]
    if (!feature) return null
    return { address: feature.place_name ?? null, mapboxPlaceId: feature.id ?? null }
  } catch {
    return null
  }
}
