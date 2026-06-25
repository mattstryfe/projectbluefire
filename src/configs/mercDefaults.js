// Merc module constants. Mirrors appDefaults.js conventions — all new Merc magic numbers belong here.

// Routing / identity — used in routerLinksSchema and across Merc views
export const MERC_BASE_PATH = '/merc'
export const MERC_MODULE_NAME = 'Merc'

// Default map view — NOVA market (Pearson Realty). Map base is Mapbox GL (MER-9; map-engine
// decision = ADR-006).
export const MERC_MAP_DEFAULT_CENTER = { lat: 38.9, lng: -77.4 }
export const MERC_MAP_DEFAULT_ZOOM = 11
// Dark style to match the Merc shell. Swap freely (e.g. mapbox/standard for 3D).
export const MERC_MAP_STYLE = 'mapbox://styles/mapbox/dark-v11'

// First-load cinematic fly-to (MER-26). Open wide (regional) and sweep down into the market.
// Gated to play once per session and skipped under prefers-reduced-motion — see mercShellStore.
export const MERC_MAP_INTRO_START_ZOOM = 4.5
export const MERC_MAP_INTRO_DURATION_MS = 3500
export const MERC_MAP_INTRO_CURVE = 1.42 // flyTo zoom-out arc (Mapbox default; higher = more dramatic)

// App shell (MER-9) — bottom nav heights. Mirrors BlueFire's MobileBottomNavigationMenu shim:
// native gets extra height to clear the gesture inset.
export const MERC_BOTTOM_NAV_HEIGHT = 64
export const MERC_BOTTOM_NAV_HEIGHT_NATIVE = 108
