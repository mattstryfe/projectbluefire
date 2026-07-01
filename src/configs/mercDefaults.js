// Merc module constants. Mirrors appDefaults.js conventions — all new Merc magic numbers belong here.

// Routing / identity — used in routerLinksSchema and across Merc views
export const MERC_BASE_PATH = '/merc'
export const MERC_MODULE_NAME = 'Merc'

// Phase-1 demo tenant. brokerageId is stamped on every tenant-scoped doc (ADR-005); no brokerage
// is seeded yet (MER-12), so showings/listings are written against this hardcoded id for now.
export const DEMO_BROKERAGE_ID = 'pearson-realty-demo'

// Default map view — NOVA market (Pearson Realty). Map base is Mapbox GL (MER-9; map-engine
// decision = ADR-006).
export const MERC_MAP_DEFAULT_CENTER = { lat: 38.9, lng: -77.4 }
export const MERC_MAP_DEFAULT_ZOOM = 11
// Dark style to match the Merc shell. Swap freely (e.g. mapbox/standard for 3D).
export const MERC_MAP_STYLE = 'mapbox://styles/mapbox/dark-v11'

// First-load cinematic fly-to (MER-26). Open at a global/hemisphere view (zoom 2 is where Mapbox's
// globe projection shows) and sweep down into the market on every entry; skipped under
// prefers-reduced-motion or when disabled — see mercLayoutStore.
export const MERC_MAP_INTRO_START_ZOOM = 2
export const MERC_MAP_INTRO_DURATION_MS = 4500

export const MERC_MAP_INTRO_CURVE = 1.42 // flyTo zoom-out arc (Mapbox default; higher = more dramatic)

// App shell (MER-9) — bottom nav heights. Mirrors BlueFire's MobileBottomNavigationMenu shim:
// native gets extra height to clear the gesture inset.
export const MERC_BOTTOM_NAV_HEIGHT = 64
export const MERC_BOTTOM_NAV_HEIGHT_NATIVE = 108

// Post-a-showing form (MER-14) — how far ahead the time field defaults from "now" so a freshly
// opened form proposes a near-future slot rather than a time already in the past.
export const MERC_SHOWING_LEAD_HOURS = 1

// Data-flow visualization (MER-52) — a DEV-ONLY interactive Vue Flow route that renders the living
// version of MERC.md's "## Data flow" diagrams. Registered only under import.meta.env.DEV (see
// router.js), so it never ships in a production build.
export const MERC_FLOW_PATH = '/merc/flow'
export const MERC_FLOW_ROUTE_NAME = 'MercFlow'

// The architectural layers a flow node can belong to. Each carries its own color + icon so the graph
// reads at a glance which tier a node lives in (component → store → worker → firestore/realtime). The
// model references these keys; adding a layer means editing here, not the graph component.
export const MERC_FLOW_LAYERS = {
  component: { label: 'Component', color: '#3b82f6', icon: 'mdi-vuejs' }, // Merc brand blue
  store: { label: 'Store (Pinia)', color: '#14b8a6', icon: 'mdi-database-outline' },
  worker: { label: 'Worker (.js)', color: '#f59e0b', icon: 'mdi-cog-outline' },
  firestore: { label: 'Firestore', color: '#ef4444', icon: 'mdi-fire' },
  realtime: { label: 'Realtime (onSnapshot)', color: '#a855f7', icon: 'mdi-access-point' }
}

// Vue Flow canvas tuning — kept out of the SFC so the render stays declarative.
export const MERC_FLOW_MIN_ZOOM = 0.4
export const MERC_FLOW_MAX_ZOOM = 1.75
// The route keeps BlueFire chrome (dev tool, not the Merc shell); reserve the app-bar height so the
// canvas fills the rest of the viewport.
export const MERC_FLOW_TOP_OFFSET_PX = 64
