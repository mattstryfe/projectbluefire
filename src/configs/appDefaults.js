// Theme — global light/dark (MER-25). Persisted in localStorage for pre-paint apply
// (plugins/vuetify.js) and mirrored to the Firestore profile for signed-in users (userStore).
export const THEME_STORAGE_KEY = 'bluefire:dark-mode'
export const THEME_DARK = 'dark'
export const THEME_LIGHT = 'light'
export const DEFAULT_DARK_MODE = true

// Geolocation — used in userStore
export const GEO_FRESHNESS_MS = 5 * 60 * 1000
export const GEO_POSITION_TIMEOUT_MS = 10000
export const MAX_ZIP_HISTORY = 10

// Alert auto-dismiss — used in JustTheWeather, ZipcodeToolbar
export const CACHED_ALERT_DISMISS_MS = 5000

// Keyboard blur delay — used in ZipcodeToolbar
export const KEYBOARD_BLUR_DELAY_MS = 100

// Pull-to-refresh — used in App.vue
export const PULL_TO_REFRESH_THRESHOLD_PX = 100

// Precipitation display thresholds — used in ForecastCard, ForecastCardFeatured
export const PRECIP_CHANCE_THRESHOLD = 25
export const PRECIP_TOTAL_THRESHOLD = 0

// Temperature color scale — used in weatherUtils for condition icon color.
// Ordered highest-first so Array.find() returns the first matching band.
// TODO: TG-68: support per-user climate offset/multiplier for regional calibration (e.g., Alaska where 50°F is warm)
export const TEMP_COLOR_SCALE = [
  { min: 105, color: 'purple' },
  { min: 95, color: 'red' },
  { min: 85, color: 'orange' },
  { min: 75, color: 'yellow-darken-2' },
  { min: 50, color: 'grey' },
  { min: 30, color: 'blue' },
  { min: null, color: 'blue-darken-3' }
]

// NWS weather property modes — used in weatherUtils
export const PROPERTY_MODES = {
  POINT: 'point',
  ACCUMULATE: 'accumulate',
  HOURLY: 'hourly'
}

// Chart gradient options — used in useWeatherChart
export const CHART_GRADIENT_MODES = ['icyToDark', 'darkToIcy', 'none']
