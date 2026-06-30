<template>
  <!-- Mapbox GL needs a plain element to mount its canvas into — this div is the map root, not
       decorative markup. Open showings stream in as pins via a GeoJSON source (MER-18). -->
  <div ref="mapContainer" class="merc-map" />
</template>

<script setup>
import 'mapbox-gl/dist/mapbox-gl.css'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { distanceBetween } from 'geofire-common'
import { useMercLayoutStore } from '@/stores/mercLayoutStore'
import { useMercShowingsStore } from '@/stores/mercShowingsStore'
import { useMercAuthStore } from '@/stores/mercAuthStore'
import { showingsToGeoJSON } from '@/utils/mercShowingsToGeoJSON'
import {
  MERC_MAP_DEFAULT_CENTER,
  MERC_MAP_DEFAULT_ZOOM,
  MERC_MAP_STYLE,
  MERC_MAP_INTRO_START_ZOOM,
  MERC_MAP_INTRO_DURATION_MS,
  MERC_MAP_INTRO_CURVE
} from '@/configs/mercDefaults'

// One GeoJSON source feeds all rendering, so clustering / a heatmap layer / richer data-driven
// styling drop in later WITHOUT changing the data path (MER-18 architecture).
const SHOWINGS_SOURCE = 'merc-showings'
const SHOWINGS_CIRCLES = 'merc-showings-circles'

const mercLayoutStore = useMercLayoutStore()
const mercShowingsStore = useMercShowingsStore()
const mercAuthStore = useMercAuthStore()
const mapContainer = ref(null)
let map = null
let resizeObserver = null
let destroyed = false

// uid changes from several entry points (dev switcher, sign-in modal, sign-out). A single leaf
// reaction recolors the existing pins (mine vs marketplace) — the multi-producer case where reacting
// beats threading the call into every auth path. (Map DATA still updates only via the explicit
// onData; this only re-derives coloring from the data already in the store.)
watch(() => mercAuthStore.getUserUid, () => applyShowingsToMap(mercShowingsStore.mapShowings))

// Push streamed rows into the Mapbox source. Called EXPLICITLY from the subscription's onData (the GL
// map is imperative, so the data event drives the render directly) AND from the uid watch below so a
// switch recolors without a reload.
function applyShowingsToMap(rows) {
  const showingsSource = map && map.getSource(SHOWINGS_SOURCE)
  if (showingsSource) showingsSource.setData(showingsToGeoJSON(rows, { currentUid: mercAuthStore.getUserUid }))
}

// Center + a radius reaching the viewport corner, so the geohash query covers what's on screen.
function currentArea() {
  const center = map.getCenter()
  const northEast = map.getBounds().getNorthEast()
  return {
    center: { lat: center.lat, lng: center.lng },
    radiusM: distanceBetween([center.lat, center.lng], [northEast.lat, northEast.lng]) * 1000
  }
}

function resubscribe() {
  if (!map) return
  mercShowingsStore.startMapSubscription(currentArea(), { onData: applyShowingsToMap })
}
// Pan/zoom fires moveend rapidly; debounce so the bounded listener set rebuilds once movement settles.
const debouncedResubscribe = useDebounceFn(resubscribe, 300)

onMounted(async () => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  if (!token) {
    // No hard crash without a token — log and bail so the rest of the shell stays usable.
    console.warn('[merc] VITE_MAPBOX_TOKEN missing — add it to .env.local to render the map.')
    return
  }

  // Dynamic import keeps the heavy GL library out of the initial chunk so the shell paints first.
  const { default: mapboxgl } = await import('mapbox-gl')
  if (destroyed || !mapContainer.value) return // component unmounted while the lib loaded

  // First-load cinematic fly-to (MER-26): start global and sweep in, unless disabled / reduced-motion.
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const playIntro = mercLayoutStore.introEnabled && !reduceMotion

  mapboxgl.accessToken = token
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: `${MERC_MAP_STYLE}?optimize=true`, // style-optimized vector tiles (drops unused layers)
    center: [MERC_MAP_DEFAULT_CENTER.lng, MERC_MAP_DEFAULT_CENTER.lat], // Mapbox is [lng, lat]
    zoom: playIntro ? MERC_MAP_INTRO_START_ZOOM : MERC_MAP_DEFAULT_ZOOM,
    // (i) attribution control removed per request. ⚠️ Mapbox ToS requires attribution — re-add
    // (or surface it elsewhere) before production. The Mapbox wordmark logo stays.
    attributionControl: false
  })

  map.on('load', () => {
    if (!map) return
    // Container can reach its real size AFTER init (flex / Capacitor WebView); keep it sized.
    map.resize()

    // One GeoJSON source + a circle layer. Mine = amber, marketplace = blue (Merc accent).
    map.addSource(SHOWINGS_SOURCE, {
      type: 'geojson',
      data: showingsToGeoJSON(mercShowingsStore.mapShowings, { currentUid: mercAuthStore.getUserUid })
    })
    map.addLayer({
      id: SHOWINGS_CIRCLES,
      type: 'circle',
      source: SHOWINGS_SOURCE,
      paint: {
        'circle-radius': 7,
        'circle-color': ['case', ['get', 'isMine'], '#f59e0b', '#3b82f6'],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    })

    // Start the live feed for the current view, then keep it bounded to the viewport on pan/zoom.
    resubscribe()
    map.on('moveend', debouncedResubscribe)

    if (playIntro) {
      map.flyTo({
        center: [MERC_MAP_DEFAULT_CENTER.lng, MERC_MAP_DEFAULT_CENTER.lat],
        zoom: MERC_MAP_DEFAULT_ZOOM,
        duration: MERC_MAP_INTRO_DURATION_MS,
        curve: MERC_MAP_INTRO_CURVE,
        essential: true // we already gate reduced-motion above
      })
    }
  })

  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => map && map.resize())
    resizeObserver.observe(mapContainer.value)
  }
})

onUnmounted(() => {
  destroyed = true
  mercShowingsStore.stopMapSubscription()
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.merc-map {
  height: 100%;
  width: 100%;
}
</style>
