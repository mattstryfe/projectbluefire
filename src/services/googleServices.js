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

export async function getCoordsFromZip(zipCode) {
  const apiKey = import.meta.env.VITE_GOOGLE_WEB_ACCESS_API_KEY
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`
  )
  const data = await response.json()

  if (data.results?.[0]?.geometry?.location) {
    return {
      lat: data.results[0].geometry.location.lat,
      lng: data.results[0].geometry.location.lng
    }
  }

  return null
}
