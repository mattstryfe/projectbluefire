// Geolocation — used in userStore
export const GEO_FRESHNESS_MS = 5 * 60 * 1000
export const GEO_POSITION_TIMEOUT_MS = 10000

// Alert auto-dismiss — used in JustTheWeather, ZipcodeToolbar
export const CACHED_ALERT_DISMISS_MS = 5000

// Keyboard blur delay — used in ZipcodeToolbar
export const KEYBOARD_BLUR_DELAY_MS = 100

// Pull-to-refresh — used in App.vue
export const PULL_TO_REFRESH_THRESHOLD_PX = 100

// NWS weather property modes — used in weatherUtils
export const PROPERTY_MODES = {
  POINT: 'point',
  ACCUMULATE: 'accumulate',
  HOURLY: 'hourly'
}

// Chart gradient options — used in useWeatherChart
export const CHART_GRADIENT_MODES = ['icyToDark', 'darkToIcy', 'none']
