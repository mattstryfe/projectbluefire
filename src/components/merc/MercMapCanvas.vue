<template>
  <!-- Mapbox GL needs a plain element to mount its canvas into — this div is the map root, not
       decorative markup. Live map (MER-9); no markers yet (showings render here later). -->
  <div ref="mapContainer" class="merc-map" />
</template>

<script setup>
import 'mapbox-gl/dist/mapbox-gl.css'
import { ref, onMounted, onUnmounted } from 'vue'
import { useMercShellStore } from '@/stores/mercShellStore'
import {
  MERC_MAP_DEFAULT_CENTER,
  MERC_MAP_DEFAULT_ZOOM,
  MERC_MAP_STYLE,
  MERC_MAP_INTRO_START_ZOOM,
  MERC_MAP_INTRO_DURATION_MS,
  MERC_MAP_INTRO_CURVE
} from '@/configs/mercDefaults'

const shell = useMercShellStore()
const mapContainer = ref(null)
let map = null
let resizeObserver = null
let destroyed = false

onMounted(async () => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  if (!token) {
    // No hard crash without a token — log and bail so the rest of the shell stays usable.
    console.warn('[merc] VITE_MAPBOX_TOKEN missing — add it to .env.local to render the map.')
    return
  }

  // Dynamic import keeps the heavy GL library out of the initial chunk so the shell (top bar +
  // nav) paints first and the map streams in — a real perceived-perf win on mobile.
  const { default: mapboxgl } = await import('mapbox-gl')
  if (destroyed || !mapContainer.value) return // component unmounted while the lib loaded

  // First-load cinematic fly-to (MER-26): start wide and sweep in — but only on the first entry
  // this session, only if the user hasn't disabled it, and never under prefers-reduced-motion.
  // When not playing we just construct at the normal zoom, so the static view is indistinguishable.
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const playIntro = shell.shouldPlayIntro && !reduceMotion

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

  // In a flex/fixed layout — and especially the Capacitor WebView — the container can reach its
  // real size AFTER init; without a resize the map renders the whole world zoomed out and stays
  // there. Keep it sized to its container. (Mapbox equivalent of Leaflet's invalidateSize.)
  map.on('load', () => {
    if (!map) return
    map.resize()
    if (playIntro) {
      // Flag before flying so navigating away mid-flight and back this session won't replay it.
      shell.markIntroPlayed()
      map.flyTo({
        center: [MERC_MAP_DEFAULT_CENTER.lng, MERC_MAP_DEFAULT_CENTER.lat],
        zoom: MERC_MAP_DEFAULT_ZOOM,
        duration: MERC_MAP_INTRO_DURATION_MS,
        curve: MERC_MAP_INTRO_CURVE,
        essential: true // we already gate reduced-motion above; keep GL from second-guessing the animation
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
