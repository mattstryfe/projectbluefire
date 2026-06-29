// Merc showings logic — a plain worker module (not a store, not a component). It holds the actual
// Firestore writes and geolocation/geocode orchestration so the Pinia store stays thin and only
// owns vue-y reactive state.
//
// PROJECT RULE: a worker .js never imports a Pinia store. Callers inject what it needs (here, the
// notification helpers) as params. This keeps the module store-agnostic — portable toward real
// service workers / other abstractions later, and trivial to test.
import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { geohashForLocation } from 'geofire-common'
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
