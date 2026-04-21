export async function getLocalityInfoFromCoords(lat, lng) {
  const apiKey = import.meta.env.VITE_GOOGLE_WEB_ACCESS_API_KEY
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  )
  const data = await response.json()

  const components = data.results[0]?.address_components ?? []
  const find = (type) =>
    components.find((c) => c.types.includes(type))?.long_name

  const findShort = (type) =>
    components.find((c) => c.types.includes(type))?.short_name

  return {
    state: findShort('administrative_area_level_1'),
    zipcode: find('postal_code'),
    city:
      find('locality') ||
      find('sublocality_level_1') ||
      find('sublocality') ||
      find('neighborhood') ||
      find('postal_town') ||
      find('administrative_area_level_3') ||
      find('administrative_area_level_2') ||
      null
  }
}

export async function getCoordsFromZip(zipcode) {
  const apiKey = import.meta.env.VITE_GOOGLE_WEB_ACCESS_API_KEY
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${apiKey}`
  )
  const data = await response.json()

  const components = data.results[0]?.address_components ?? []
  const find = (type) =>
    components.find((c) => c.types.includes(type))?.long_name

  const findShort = (type) =>
    components.find((c) => c.types.includes(type))?.short_name

  return {
    lat: data.results[0].geometry?.location.lat,
    lng: data.results[0].geometry?.location.lng,
    state: findShort('administrative_area_level_1'),
    zipcode: find('postal_code'),
    city:
      find('locality') ||
      find('sublocality_level_1') ||
      find('sublocality') ||
      find('neighborhood') ||
      find('postal_town') ||
      find('administrative_area_level_3') ||
      find('administrative_area_level_2') ||
      null
  }
}

export async function getWeatherUrlsForThisZipcode(lat, lng, signal) {
  const response = await fetch(`https://api.weather.gov/points/${lat},${lng}`, {
    signal
  })
  const data = await response.json()

  return {
    forecast: data.properties.forecast,
    forecastHourly: data.properties.forecastHourly,
    gridData: data.properties.forecastGridData
  }
}
