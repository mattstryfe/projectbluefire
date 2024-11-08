import axios from 'axios'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_WEB_ACCESS_API_KEY
const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'

export const getDetailedLocationInfo = async (lat, lng) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        latlng: `${lat},${lng}`,
        key: GOOGLE_API_KEY
      }
    })

    if (response.data.status !== 'OK') {
      throw new Error(`Google API Error: ${response.data.status}`)
    }

    // Parse the results
    const result = {
      zipCode: null,
      city: null,
      state: null,
      formattedAddress: null
    }

    const addressComponents = response.data.results[0]?.address_components || []

    // Extract relevant information
    addressComponents.forEach((component) => {
      if (component.types.includes('postal_code')) {
        result.zipCode = component.long_name
      }
      if (component.types.includes('locality')) {
        result.city = component.long_name
      }
      if (component.types.includes('administrative_area_level_1')) {
        result.state = component.short_name
      }
    })

    result.formattedAddress = response.data.results[0]?.formatted_address

    return result
  } catch (error) {
    console.error('Error in Google Geocoding Service:', error)
    throw new Error(error.response?.data?.error_message || error.message)
  }
}

export const getLocation = async () => {
  try {
    return await getPosition()
  } catch (error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        throw new Error('Location permission denied')
      case error.POSITION_UNAVAILABLE:
        throw new Error('Location unavailable')
      case error.TIMEOUT:
        throw new Error('Location request timed out')
      default:
        throw error
    }
  }
}

// Modern geolocation API
export const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  })
}
