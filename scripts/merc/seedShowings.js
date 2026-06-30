// Real-agent test-data seeder for merc-alpha (DEV). Creates the dev test agents (Auth user +
// agents/{uid} profile) and seeds open showings attributed to their REAL uids — so the map's
// mine-vs-marketplace coloring, the "my showings" sheet, and cross-account streaming can be tested
// against real data instead of synthetic stand-ins.
//
// Idempotent: clears existing showings/properties first (agents are reused by uid via create-or-
// sign-in), so you always land on a known state. merc-alpha is test-mode (open rules), so the public
// web config is enough. The shared password comes from .env.local (VITE_MERC_DEV_PASSWORD) so it
// stays out of git.
//
// Usage:  node scripts/merc/seedShowings.js [perAgent]   (default 10; clamped to 8–15)
import { readFileSync } from 'node:fs'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  deleteDoc,
  setDoc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore'
import { geohashForLocation } from 'geofire-common'
import { mercFirebaseConfig } from '../../src/configs/mercFirebaseConfig.js'
import {
  MERC_COLLECTIONS,
  MERC_SHOWING_PRIVATE_SUBCOLLECTION,
  MERC_SHOWING_CONTACT_DOC_ID,
  agentSchema,
  propertySchema,
  showingSchema,
  showingContactSchema
} from '../../src/configs/mercDataSchema.js'
import { DEMO_BROKERAGE_ID } from '../../src/configs/mercDefaults.js'
import { MERC_DEV_AGENTS, devAgentPhotoURL } from '../../src/configs/mercDevAgents.js'

function envLocal(key, fallback = null) {
  try {
    const txt = readFileSync(new URL('../../.env.local', import.meta.url), 'utf8')
    const m = txt.match(new RegExp(`^${key}=(.*)$`, 'm'))
    return m ? m[1].trim() : fallback
  } catch {
    return fallback
  }
}

const PASSWORD = envLocal('VITE_MERC_DEV_PASSWORD', 'password')
const PER_AGENT = Math.min(Math.max(Number(process.argv[2]) || 10, 8), 15)

// NOVA spots clustered around MERC_MAP_DEFAULT_CENTER (38.9, -77.4) so seeded pins land inside the
// default zoom-11 viewport — still spread enough to exercise multiple geohash cells later.
const SPOTS = [
  { town: 'Chantilly', lat: 38.894, lng: -77.431 },
  { town: 'Centreville', lat: 38.84, lng: -77.429 },
  { town: 'Oak Hill', lat: 38.918, lng: -77.412 },
  { town: 'Herndon', lat: 38.969, lng: -77.386 },
  { town: 'Reston', lat: 38.958, lng: -77.357 },
  { town: 'Fair Oaks', lat: 38.871, lng: -77.358 },
  { town: 'Fairfax', lat: 38.846, lng: -77.306 },
  { town: 'Vienna', lat: 38.901, lng: -77.265 },
  { town: 'Franklin Farm', lat: 38.905, lng: -77.4 },
  { town: 'Greenbriar', lat: 38.875, lng: -77.412 }
]
const STREETS = ['Main St', 'Maple Ave', 'Loudoun St', 'Colonial Hwy', 'Evening Star Dr', 'Madison St', 'Church St']
const ALLOCATIONS = [50, 60, 75, 90, 110, 125, 150]

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const jitter = (v) => v + (Math.random() - 0.5) * 0.02

const app = initializeApp(mercFirebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function ensureUser(email) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, PASSWORD)
    return cred.user.uid
  } catch (e) {
    if (e?.code === 'auth/email-already-in-use') {
      const cred = await signInWithEmailAndPassword(auth, email, PASSWORD)
      return cred.user.uid
    }
    throw e
  }
}

async function clearCollection(name, perDoc) {
  const snap = await getDocs(collection(db, name))
  for (const d of snap.docs) {
    if (perDoc) await perDoc(d)
    await deleteDoc(d.ref)
  }
  return snap.size
}

// 1) Clean slate for showings/properties (agents persist across runs).
const removedShowings = await clearCollection(MERC_COLLECTIONS.showings, (d) =>
  deleteDoc(doc(db, MERC_COLLECTIONS.showings, d.id, MERC_SHOWING_PRIVATE_SUBCOLLECTION, MERC_SHOWING_CONTACT_DOC_ID))
)
const removedProps = await clearCollection(MERC_COLLECTIONS.properties)
console.log(`Cleared ${removedShowings} showing(s), ${removedProps} property(ies).`)

// 2) For each agent: ensure Auth user + profile doc + showings (written while signed in as them).
let total = 0
for (const [idx, agent] of MERC_DEV_AGENTS.entries()) {
  const uid = await ensureUser(agent.email)

  await setDoc(
    doc(db, MERC_COLLECTIONS.agents, uid),
    agentSchema.parse({
      uid,
      brokerageId: DEMO_BROKERAGE_ID,
      displayName: agent.displayName,
      email: agent.email,
      phone: agent.phone,
      photoURL: devAgentPhotoURL(agent.email),
      role: 'agent',
      verificationStatus: null,
      verificationMethod: null,
      membershipStatus: 'approved',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  )

  const batch = writeBatch(db) // PER_AGENT ≤ 15 → ≤ 45 ops, well under the 500-op batch limit
  for (let i = 0; i < PER_AGENT; i++) {
    const spot = SPOTS[(idx * 3 + i) % SPOTS.length]
    const lat = jitter(spot.lat)
    const lng = jitter(spot.lng)
    const geohash = geohashForLocation([lat, lng])
    const address = `${100 + Math.floor(Math.random() * 900)} ${pick(STREETS)}, ${spot.town} VA`

    const propertyRef = doc(collection(db, MERC_COLLECTIONS.properties))
    const showingRef = doc(collection(db, MERC_COLLECTIONS.showings))
    const contactRef = doc(showingRef, MERC_SHOWING_PRIVATE_SUBCOLLECTION, MERC_SHOWING_CONTACT_DOC_ID)

    batch.set(
      propertyRef,
      propertySchema.parse({
        address, lat, lng, mapboxPlaceId: null, normalizedAddress: null, geohash, apn: null,
        archived: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      })
    )
    batch.set(
      showingRef,
      showingSchema.parse({
        brokerageId: DEMO_BROKERAGE_ID, propertyId: propertyRef.id, listingId: null,
        postingAgentId: uid, claimingAgentId: null, participantIds: [uid], status: 'open',
        property: { address, lat, lng }, geohash,
        scheduledAt: new Date(Date.now() + (1 + Math.floor(Math.random() * 7)) * 86400000),
        allocation: pick(ALLOCATIONS), archived: false,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      })
    )
    batch.set(
      contactRef,
      showingContactSchema.parse({
        brokerageId: DEMO_BROKERAGE_ID,
        name: `Client of ${agent.displayName}`,
        email: `client.${agent.displayName.toLowerCase()}@example.com`,
        phone: '555-0188'
      })
    )
  }
  await batch.commit()
  total += PER_AGENT
  console.log(`Seeded ${PER_AGENT} showings for ${agent.displayName} (${agent.email}) → uid ${uid}`)
}

console.log(`Done: ${MERC_DEV_AGENTS.length} agents, ${total} open showings.`)
process.exit(0)
