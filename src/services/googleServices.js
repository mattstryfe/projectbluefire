export async function getZipFromCoords(lat, lng) {
  const apiKey = import.meta.env.VITE_GOOGLE_WEB_ACCESS_API_KEY
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  )
  const data = await response.json()
  return data.results[0]?.address_components.find((c) =>
    c.types.includes('postal_code')
  )?.long_name
}
