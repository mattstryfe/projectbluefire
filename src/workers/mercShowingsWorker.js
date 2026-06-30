// Merc showings logic — a plain worker module (not a store, not a component). It holds the actual
// Firestore writes and geolocation/geocode orchestration so the Pinia store stays thin and only
// owns vue-y reactive state.
//
// PROJECT RULE: a worker .js never imports a Pinia store. Callers inject what it needs (here, the
// notification helpers) as params. This keeps the module store-agnostic — portable toward real
// service workers / other abstractions later, and trivial to test.
import {
  collection,
  doc,
  endAt,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAt,
  where,
  writeBatch
} from 'firebase/firestore'
import { distanceBetween, geohashForLocation, geohashQueryBounds } from 'geofire-common'
import { Geolocation } from '@capacitor/geolocation'
import { mercDb, mercAuth } from '@/plugins/mercFirebase'
import {
  MERC_COLLECTIONS,
  MERC_SHOWING_CONTACT_DOC_ID,
  MERC_SHOWING_PRIVATE_SUBCOLLECTION,
  propertySchema,
  showingContactSchema,
  showingSchema
} from '@/configs/mercDataSchema'
import { DEMO_BROKERAGE_ID, MERC_MAP_DEFAULT_CENTER } from '@/configs/mercDefaults'
import { geocodeAddress, reverseGeocode } from '@/utils/mercGeocode'

/**
 * Lazily create a Property (opaque id + best-effort hints) then write the Showing that hangs off it
 * (property-as-root, ADR-007). Coords come from explicit coords (current location / a saved client)
 * or forward-geocoding the typed address; a miss falls back to the market center so the write never
 * blocks. geohash derives from the final coords (never misses).
 *
 * @param {{ notify: Function }} deps - injected notification helper (NO store import here)
 * @param {object} payload
 * @param {string} payload.address
 * @param {{name:string,email:string,phone:string}} payload.client
 * @param {Date} payload.scheduledAt
 * @param {number} payload.allocation
 * @param {{lat:number,lng:number}|null} [payload.coords]
 * @returns {Promise<{ok:boolean, showingId?:string, propertyId?:string, reason?:string}>}
 */
export async function postShowing({ notify }, { address, client, scheduledAt, allocation, coords }) {
  const uid = mercAuth.currentUser?.uid
  if (!uid) {
    notify({
      message: 'Sign in to Merc to post a showing.',
      color: 'warning',
      icon: 'mdi-account-alert-outline',
      timeout: 5000
    })
    return { ok: false, reason: 'unauthenticated' }
  }

  try {
    // Prefer explicit coords; otherwise forward-geocode the typed address. A geocode miss falls
    // back to the market center so the write never blocks. geohash derives from the final coords.
    let geo = null
    let lat
    let lng
    if (coords && Number.isFinite(coords.lat) && Number.isFinite(coords.lng)) {
      lat = coords.lat
      lng = coords.lng
    } else {
      geo = await geocodeAddress(address)
      lat = geo?.lat ?? MERC_MAP_DEFAULT_CENTER.lat
      lng = geo?.lng ?? MERC_MAP_DEFAULT_CENTER.lng
    }
    const geohash = geohashForLocation([lat, lng])

    const propertyDoc = propertySchema.parse({
      address,
      lat,
      lng,
      mapboxPlaceId: geo?.mapboxPlaceId ?? null,
      normalizedAddress: geo?.normalizedAddress ?? null,
      geohash,
      apn: null,
      archived: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Pre-generate refs so the property, the showing, and the client-contact PII subdoc all commit in
    // ONE atomic batch — no half-written showing, and the contact never lands without its parent.
    const propertyRef = doc(collection(mercDb, MERC_COLLECTIONS.properties))
    const showingRef = doc(collection(mercDb, MERC_COLLECTIONS.showings))
    const contactRef = doc(showingRef, MERC_SHOWING_PRIVATE_SUBCOLLECTION, MERC_SHOWING_CONTACT_DOC_ID)

    const showingDoc = showingSchema.parse({
      brokerageId: DEMO_BROKERAGE_ID,
      propertyId: propertyRef.id,
      listingId: null,
      postingAgentId: uid,
      claimingAgentId: null,
      participantIds: [uid],
      status: 'open',
      property: { address, lat, lng },
      geohash,
      scheduledAt,
      allocation,
      archived: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Client PII goes to the private subcollection (NOT the showing doc) so it stays off the bulk map
    // stream; brokerageId is denormalized for MER-11's read rule. (showings/{id}/private/contact)
    const contactDoc = showingContactSchema.parse({
      brokerageId: DEMO_BROKERAGE_ID,
      name: client.name,
      email: client.email,
      phone: client.phone
    })

    const batch = writeBatch(mercDb)
    batch.set(propertyRef, propertyDoc)
    batch.set(showingRef, showingDoc)
    batch.set(contactRef, contactDoc)
    await batch.commit()

    notify({
      message: 'Showing posted.',
      color: 'success',
      icon: 'mdi-check-circle-outline',
      timeout: 4000
    })
    return { ok: true, showingId: showingRef.id, propertyId: propertyRef.id }
  } catch (e) {
    console.error('[merc] postShowing failed:', e)
    notify({
      message: `Couldn't post showing: ${e?.message ?? 'unknown error'}`,
      color: 'error',
      icon: 'mdi-alert-circle-outline',
      timeout: 6000
    })
    return { ok: false, reason: 'error' }
  }
}

/**
 * Resolve the device's current position to coords + a readable address (for the "Use current
 * location" button). Capacitor Geolocation (web + native) + Mapbox reverse-geocode. Best-effort;
 * never throws — the injected notify/removeNotify narrate progress and the caller falls back to
 * typing the address.
 *
 * @param {{ notify: Function, removeNotify: Function }} deps - injected notification helpers
 * @returns {Promise<{ok:boolean, coords:{lat:number,lng:number}|null, address:string|null}>}
 */
export async function getCurrentLocation({ notify, removeNotify }) {
  const gettingId = notify({
    message: 'Getting your location…',
    color: 'info',
    icon: 'mdi-crosshairs-gps'
  })

  try {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000
    })
    const coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }

    const rev = await reverseGeocode(coords.lat, coords.lng)
    removeNotify(gettingId)
    if (rev?.address) {
      notify({
        message: 'Address set from your current location.',
        color: 'success',
        icon: 'mdi-map-marker-check-outline',
        timeout: 3000
      })
      return { ok: true, coords, address: rev.address }
    }

    // Position fixed but no address matched — keep the coords so the write still lands precisely.
    notify({
      message: 'Location found, but no address matched — coordinates saved.',
      color: 'info',
      icon: 'mdi-map-marker-outline',
      timeout: 4000
    })
    return { ok: true, coords, address: null }
  } catch {
    removeNotify(gettingId)
    notify({
      message: 'Could not get your location — type the address instead.',
      color: 'warning',
      icon: 'mdi-map-marker-alert-outline',
      timeout: 5000
    })
    return { ok: false, coords: null, address: null }
  }
}

/**
 * Live marketplace feed for the MAP: open showings within `radiusM` of `center`, streamed.
 *
 * Firestore can't range-filter lat AND lng together, so we geohash: geohashQueryBounds returns up to
 * ~9 geohash prefix ranges covering the circle; EACH range is its own onSnapshot (a geohash range
 * can't share one query with the brokerage/status/archived equalities), so they run in parallel and
 * merge client-side. Per-range results live in slots and are re-merged on every snapshot, so removals
 * (status flips, archives) fall out automatically. Geohash ranges are coarse — we drop the true
 * false-positives (outside the real radius) by distance.
 *
 * Requires the composite index (brokerageId, status, archived, geohash) — see firestore.indexes.json.
 * Without it onSnapshot errors FAILED_PRECONDITION with a one-click console link (surfaced via onError).
 *
 * @param {{ center:{lat:number,lng:number}, radiusM:number }} area
 * @param {{ onChange:(rows:object[])=>void, onError?:(e:Error)=>void }} cbs
 * @returns {() => void} unsubscribe — tears down every range listener
 */
export function subscribeOpenShowingsInBounds({ center, radiusM }, { onChange, onError }) {
  const bounds = geohashQueryBounds([center.lat, center.lng], radiusM)
  const slots = bounds.map(() => new Map()) // one Map<id,row> per range; re-merged on each snapshot

  const emit = () => {
    const merged = new Map()
    for (const slot of slots) for (const [id, row] of slot) merged.set(id, row)
    onChange(Array.from(merged.values()))
  }

  const unsubs = bounds.map(([start, end], i) => {
    const q = query(
      collection(mercDb, MERC_COLLECTIONS.showings),
      where('brokerageId', '==', DEMO_BROKERAGE_ID),
      where('status', '==', 'open'),
      where('archived', '==', false),
      orderBy('geohash'),
      startAt(start),
      endAt(end)
    )
    return onSnapshot(
      q,
      (snap) => {
        const slot = new Map()
        snap.forEach((docSnap) => {
          const showingData = docSnap.data()
          const { lat, lng } = showingData.property ?? {}
          // Drop geohash false-positives outside the true circle (distanceBetween is in km).
          if (
            Number.isFinite(lat) &&
            Number.isFinite(lng) &&
            distanceBetween([lat, lng], [center.lat, center.lng]) * 1000 > radiusM
          ) {
            return
          }
          slot.set(docSnap.id, { id: docSnap.id, ...showingData })
        })
        slots[i] = slot
        emit()
      },
      (e) => {
        console.error('[merc] map showings subscription error:', e)
        onError?.(e)
      }
    )
  })

  return () => unsubs.forEach((u) => u())
}

/**
 * Live "my showings" feed for the SHEET: every showing the agent participates in (posted or claimed),
 * any status, any location. A single onSnapshot on `participantIds array-contains uid` (single-field
 * index — no composite needed). brokerageId/archived filtering and sorting are done client-side so
 * this can't trip a missing-index error. The PII contact subdoc is NOT read here (fetched on demand).
 *
 * @param {string} uid
 * @param {{ onChange:(rows:object[])=>void, onError?:(e:Error)=>void }} cbs
 * @returns {() => void} unsubscribe
 */
export function subscribeMyShowings(uid, { onChange, onError }) {
  const q = query(
    collection(mercDb, MERC_COLLECTIONS.showings),
    where('participantIds', 'array-contains', uid)
  )
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((r) => r.brokerageId === DEMO_BROKERAGE_ID && !r.archived)
      onChange(rows)
    },
    (e) => {
      console.error('[merc] my showings subscription error:', e)
      onError?.(e)
    }
  )
}
