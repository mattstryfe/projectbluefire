// MER-52 — Merc data-flow graph MODEL (data-driven, single source of truth for the /merc/flow route).
//
// This is the LIVING version of MERC.md's "## Data flow" section (the Mermaid flowchart + sequence
// diagrams). The interactive route (MercFlow.vue) is a pure renderer over this model — adding or
// changing a step means editing THIS file, never redrawing anything in the component.
//
// Each node carries:
//   • layer   — component | store | worker | firestore | realtime (drives color/icon via MERC_FLOW_LAYERS)
//   • label   — short display name shown on the node
//   • source  — the real file the node maps to (shown in the side panel; anti-drift anchor below)
//   • exportName — for store/worker nodes, the ACTUAL exported member this node stands for. The
//     dev-time check (mercFlowModelCheck.js) asserts these resolve to real exports so the graph can't
//     silently drift from the code.
//   • payload — the data shape / responsibility at this step (the "what flows here")
//   • forks   — the branches/decisions at this step (the "what can happen instead")
//
// Edges carry a `kind` (action | subscription | write | realtime) so the renderer can style them and
// the reader can tell an imperative call from a live listener.
//
// Layout is hand-authored (x/y) into three readable columns: the post pipeline (top-down), the two
// realtime listeners (fanning out from Firestore), and the auth lane (left). Positions are data, not
// magic numbers in the component.

import {
  MERC_COLLECTIONS,
  MERC_SHOWING_PRIVATE_SUBCOLLECTION,
  MERC_SHOWING_CONTACT_DOC_ID
} from '@/configs/mercDataSchema'

// Column x-anchors + row rhythm — keeps the hand-authored positions consistent and self-documenting.
const COL = { auth: 40, post: 380, listenerA: 720, listenerB: 1060 }
const ROW = (n) => 60 + n * 130

// ── Nodes ────────────────────────────────────────────────────────────────────────────────────────
// id is stable and referenced by every edge + by the anti-drift map. Keep ids kebab-ish and unique.
export const nodes = [
  // ── Auth lane (Google + email/password via the mercAuthStore modal) ──────────────────────────
  {
    id: 'auth-modal',
    layer: 'component',
    label: 'Sign-in modal (top bar)',
    source: 'src/components/merc/shell/MercTopBar.vue',
    position: { x: COL.auth, y: ROW(0) },
    payload:
      'Merc auth is a top-bar "fork" surfaced as a modal — no login page. Offers Google (popup) and ' +
      'email/password. Browsing the map is open; only posting/claiming requires a session.',
    forks: [
      'Google → signInWithGoogle (popup)',
      'Email/password → signInWithEmail',
      'New account → registerWithEmail',
      'Sign out → signOutMerc'
    ]
  },
  {
    id: 'auth-store',
    layer: 'store',
    label: 'mercAuthStore',
    source: 'src/stores/mercAuthStore.js',
    exportName: 'useMercAuthStore',
    position: { x: COL.auth, y: ROW(1) },
    payload:
      "Merc's OWN auth store (named \"merc\" Firebase app, ADR-005) — never reads BlueFire's userStore. " +
      'Owns userInfo/token/userIsAuthenticated + getUserUid/getUserEmail/getUserDisplayName and an ' +
      'authReady promise the route guard awaits. onAuthStateChanged rehydrates on refresh; DEV auto-logs ' +
      'in the merc-alpha test account.',
    forks: [
      'signInWithGoogle → GoogleAuthProvider popup',
      'signInWithEmail / registerWithEmail',
      'onAuthStateChanged → applyUser (rehydrate on refresh)',
      'DEV: auto-login via VITE_MERC_TEST_USER_* '
    ]
  },
  {
    id: 'auth-uid',
    layer: 'store',
    label: 'getUserUid (single producer)',
    source: 'src/stores/mercAuthStore.js',
    exportName: 'useMercAuthStore',
    position: { x: COL.auth, y: ROW(2) },
    payload:
      'Auth is the single producer of uid. The showings store watches getUserUid and (re)subscribes ' +
      'the "my showings" feed on login / agent-switch, and clears it on sign-out — one leaf reaction.',
    forks: ['uid present → start my-showings feed', 'uid null → stop feed, clear myShowings']
  },

  // ── Post-a-showing pipeline (component → store → worker → Firestore, property-as-root) ───────
  {
    id: 'post-form',
    layer: 'component',
    label: 'MercNewShowingForm',
    source: 'src/components/merc/showings/MercNewShowingForm.vue',
    position: { x: COL.post, y: ROW(0) },
    payload:
      'Manual "New showing" entry. Owns one reactive form model; validates, then calls ' +
      'mercShowingsStore.postShowing. Emits `close` on success (footer Post button in the wrapper ' +
      'triggers postShowing via defineExpose). "Use current location" delegates to getCurrentLocation.',
    forks: [
      'Not authenticated → warning toast, blocked',
      'Invalid form → validation stops submit',
      'Address typed → forward-geocode later',
      '"Use current location" → getCurrentLocation (coords + reverse-geocode)'
    ]
  },
  {
    id: 'post-wrapper',
    layer: 'component',
    label: 'MercPostAShowingWrapper',
    source: 'src/components/merc/showings/MercPostAShowingWrapper.vue',
    position: { x: COL.post - 210, y: ROW(0) },
    payload:
      'Fly-out shell with two tabs: pick a saved listing (prefills the form) or fill it manually. ' +
      'Owns the pinned footer whose Post button calls the form\'s exposed postShowing().',
    forks: ['Tab: From my listings → prefill()', 'Tab: New showing → manual entry']
  },
  {
    id: 'store-postShowing',
    layer: 'store',
    label: 'mercShowingsStore.postShowing',
    source: 'src/stores/mercShowingsStore.js',
    exportName: 'useMercShowingsStore',
    position: { x: COL.post, y: ROW(1) },
    payload:
      'Thin store action: flips isPosting, injects the notification helper (addNotification) into the ' +
      'worker, and awaits showingsWorker.postShowing. Holds NO Firestore logic (store↔worker layering).',
    forks: ['try → worker.postShowing', 'finally → isPosting = false']
  },
  {
    id: 'worker-postShowing',
    layer: 'worker',
    label: 'mercShowingsWorker.postShowing',
    source: 'src/workers/mercShowingsWorker.js',
    exportName: 'postShowing',
    position: { x: COL.post, y: ROW(2) },
    payload:
      'The real write path. Resolves coords (explicit coords ?? forward-geocode(address) ?? market ' +
      'center so the write never blocks), derives a geohash, Zod-validates property + showing + contact, ' +
      'and commits ONE atomic writeBatch of three docs (property-as-root, ADR-007).',
    forks: [
      'No uid → warning toast, { ok:false, reason:"unauthenticated" }',
      'coords present → use them',
      'geocode hit → use geocoded lat/lng',
      'geocode miss → MERC_MAP_DEFAULT_CENTER fallback',
      'commit throws → error toast, { ok:false, reason:"error" }'
    ]
  },
  {
    id: 'worker-getCurrentLocation',
    layer: 'worker',
    label: 'worker.getCurrentLocation',
    source: 'src/workers/mercShowingsWorker.js',
    exportName: 'getCurrentLocation',
    position: { x: COL.post - 240, y: ROW(2) },
    payload:
      'Best-effort device position → coords + readable address for the "Use current location" button. ' +
      'Capacitor Geolocation + Mapbox reverse-geocode. Never throws; narrates via injected notify.',
    forks: [
      'Fix + address → { ok:true, coords, address }',
      'Fix, no address → { ok:true, coords, address:null }',
      'Denied/timeout → { ok:false } + warning toast'
    ]
  },
  {
    id: 'firestore-batch',
    layer: 'firestore',
    label: `writeBatch ×3 → ${MERC_COLLECTIONS.properties} / ${MERC_COLLECTIONS.showings} / ${MERC_SHOWING_PRIVATE_SUBCOLLECTION}/${MERC_SHOWING_CONTACT_DOC_ID}`,
    source: 'Firestore (merc-alpha)',
    position: { x: COL.post, y: ROW(3) },
    payload:
      'One atomic batch: properties/{id} (durable anchor), showings/{id} (hangs off it via propertyId), ' +
      'and showings/{id}/private/contact (client PII kept OFF the bulk map stream). brokerageId stamped ' +
      'on every tenant-scoped doc (ADR-005).',
    forks: [
      'All three set() succeed → commit',
      'Any failure → whole batch rolls back (no half-written showing)'
    ]
  },

  // ── Realtime listener A — the MAP feed (geo-bounded open showings) ───────────────────────────
  {
    id: 'map-canvas',
    layer: 'component',
    label: 'MercMapCanvas',
    source: 'src/components/merc/map/MercMapCanvas.vue',
    position: { x: COL.listenerA, y: ROW(0) },
    payload:
      'Owns the Mapbox map. On mount (and on every debounced pan/zoom "moveend") calls ' +
      'startMapSubscription with the current viewport; tears it down on unmount. onData drives the ' +
      'imperative GeoJSON pin render directly.',
    forks: ['mount / moveend → (re)bound the feed', 'unmount → stopMapSubscription']
  },
  {
    id: 'store-mapSub',
    layer: 'store',
    label: 'store.startMapSubscription',
    source: 'src/stores/mercShowingsStore.js',
    exportName: 'useMercShowingsStore',
    position: { x: COL.listenerA, y: ROW(1) },
    payload:
      'Replaces any existing map listener first (re-bounding never leaks a listener), then delegates to ' +
      'the worker. onChange writes mapShowings (reactive) AND calls onData for the imperative render.',
    forks: ['stopMapSubscription() first', 'onChange → mapShowings + onData(rows)', 'onError → pinned error toast']
  },
  {
    id: 'worker-openInBounds',
    layer: 'worker',
    label: 'worker.subscribeOpenShowingsInBounds',
    source: 'src/workers/mercShowingsWorker.js',
    exportName: 'subscribeOpenShowingsInBounds',
    position: { x: COL.listenerA, y: ROW(2) },
    payload:
      'Geo-bounded open feed. Firestore can\'t range-filter lat AND lng, so geohashQueryBounds yields ' +
      '~9 prefix ranges; EACH range is its own onSnapshot (open, !archived, brokerage-scoped), merged ' +
      'client-side into slots. Coarse geohash false-positives are dropped by true distance.',
    forks: [
      '~9 geohash ranges → ~9 onSnapshot listeners',
      'Each snapshot → re-merge slots → onChange',
      'Missing composite index → FAILED_PRECONDITION (onError)'
    ]
  },
  {
    id: 'realtime-map',
    layer: 'realtime',
    label: 'onSnapshot ×~9 (open, !archived)',
    source: 'Firestore onSnapshot (ADR-003)',
    position: { x: COL.listenerA, y: ROW(3) },
    payload:
      'Live geohash-range listeners over showings where status == "open" && archived == false && ' +
      'brokerageId == demo. mapShowingDoc normalizes Timestamp → Date at this boundary. Removals (status ' +
      'flip / archive) fall out automatically on re-merge.',
    forks: ['snapshot add/modify → slot update', 'snapshot remove → drops from merged set']
  },
  {
    id: 'map-pins',
    layer: 'component',
    label: 'Map pins (GeoJSON)',
    source: 'src/components/merc/map/MercMapCanvas.vue',
    position: { x: COL.listenerA, y: ROW(4) },
    payload: 'mapShowings → GeoJSON source → Mapbox pin/cluster layers. All filtering/clustering is client-side.',
    forks: []
  },

  // ── Realtime listener B — the MY feed (array-contains-me → Showings sheet) ────────────────────
  {
    id: 'store-mySub',
    layer: 'store',
    label: 'store.startMyShowingsSubscription',
    source: 'src/stores/mercShowingsStore.js',
    exportName: 'useMercShowingsStore',
    position: { x: COL.listenerB, y: ROW(1) },
    payload:
      'Driven by the auth watch (NOT the sheet lifecycle): start on login, restart on agent switch, stop ' +
      'on sign-out. Replaces any existing listener; writes myShowings (reactive) on each change.',
    forks: ['uid → subscribe', 'no uid → clear myShowings', 'onError → pinned error toast']
  },
  {
    id: 'worker-mySub',
    layer: 'worker',
    label: 'worker.subscribeMyShowings',
    source: 'src/workers/mercShowingsWorker.js',
    exportName: 'subscribeMyShowings',
    position: { x: COL.listenerB, y: ROW(2) },
    payload:
      'A single onSnapshot on participantIds array-contains uid (single-field index — no composite). ' +
      'brokerageId/archived filtering and sorting are done client-side so it can\'t trip a missing-index ' +
      'error. PII contact subdoc is NOT read here.',
    forks: ['array-contains uid → one listener', 'client-side filter brokerageId + !archived']
  },
  {
    id: 'realtime-my',
    layer: 'realtime',
    label: 'onSnapshot (array-contains uid)',
    source: 'Firestore onSnapshot (ADR-003)',
    position: { x: COL.listenerB, y: ROW(3) },
    payload:
      'Live listener over every showing the signed-in agent participates in (posted ∪ claimed), any ' +
      'status, any location. mapShowingDoc normalizes Timestamp → Date here too.',
    forks: ['any status', 'any location', 'posted ∪ claimed']
  },
  {
    id: 'showings-sheet',
    layer: 'component',
    label: 'MercShowingsSheet',
    source: 'src/components/merc/showings/MercShowingsSheet.vue',
    position: { x: COL.listenerB, y: ROW(4) },
    payload:
      'Reads mercShowingsStore.myShowings (no per-open subscription). Tabs: Open / Scheduled (claimed, ' +
      'in_progress) / Completed (completed, settled). Sorts by scheduledAt (already a JS Date).',
    forks: ['Open', 'Scheduled = claimed + in_progress', 'Completed = completed + settled']
  }
]

// ── Edges ────────────────────────────────────────────────────────────────────────────────────────
// kind: action (imperative call), write (Firestore write), realtime (onSnapshot stream), subscription
// (the imperative "start listening" call that sets up a realtime stream).
export const edges = [
  // Auth lane
  { id: 'e-authmodal-store', source: 'auth-modal', target: 'auth-store', kind: 'action', label: 'sign in / register' },
  { id: 'e-authstore-uid', source: 'auth-store', target: 'auth-uid', kind: 'action', label: 'produces uid' },
  { id: 'e-uid-mysub', source: 'auth-uid', target: 'store-mySub', kind: 'action', label: 'watch → (re)subscribe' },
  { id: 'e-uid-worker', source: 'auth-uid', target: 'worker-postShowing', kind: 'action', label: 'uid gates post' },

  // Post pipeline
  { id: 'e-wrapper-form', source: 'post-wrapper', target: 'post-form', kind: 'action', label: 'tabs / prefill / Post' },
  { id: 'e-form-getloc', source: 'post-form', target: 'worker-getCurrentLocation', kind: 'action', label: 'use current location' },
  { id: 'e-form-store', source: 'post-form', target: 'store-postShowing', kind: 'action', label: 'postShowing(payload)' },
  { id: 'e-store-worker', source: 'store-postShowing', target: 'worker-postShowing', kind: 'action', label: 'inject notify; flip isPosting' },
  { id: 'e-worker-batch', source: 'worker-postShowing', target: 'firestore-batch', kind: 'write', label: 'geohash + Zod → writeBatch' },

  // Firestore write feeds both realtime listeners
  { id: 'e-batch-rtmap', source: 'firestore-batch', target: 'realtime-map', kind: 'realtime', label: 'new open showing' },
  { id: 'e-batch-rtmy', source: 'firestore-batch', target: 'realtime-my', kind: 'realtime', label: 'poster participates' },

  // Realtime A — map feed
  { id: 'e-canvas-mapsub', source: 'map-canvas', target: 'store-mapSub', kind: 'action', label: 'startMapSubscription(area)' },
  { id: 'e-mapsub-worker', source: 'store-mapSub', target: 'worker-openInBounds', kind: 'action', label: 'subscribeOpenShowingsInBounds' },
  { id: 'e-worker-rtmap', source: 'worker-openInBounds', target: 'realtime-map', kind: 'subscription', label: 'onSnapshot ×~9' },
  { id: 'e-rtmap-mapsub', source: 'realtime-map', target: 'store-mapSub', kind: 'realtime', label: 'onChange(rows)' },
  { id: 'e-mapsub-pins', source: 'store-mapSub', target: 'map-pins', kind: 'realtime', label: 'mapShowings → GeoJSON' },

  // Realtime B — my feed
  { id: 'e-mysub-worker', source: 'store-mySub', target: 'worker-mySub', kind: 'action', label: 'subscribeMyShowings(uid)' },
  { id: 'e-worker-rtmy', source: 'worker-mySub', target: 'realtime-my', kind: 'subscription', label: 'onSnapshot' },
  { id: 'e-rtmy-mysub', source: 'realtime-my', target: 'store-mySub', kind: 'realtime', label: 'onChange(rows)' },
  { id: 'e-mysub-sheet', source: 'store-mySub', target: 'showings-sheet', kind: 'realtime', label: 'myShowings (reactive)' }
]

// Anti-drift: store/worker nodes carry an `exportName`; mercFlowModelCheck.js star-imports the real
// modules at dev time and warns if any exportName no longer resolves — so the graph can't silently
// fall out of sync with the code. Component/firestore/realtime nodes name no export by design.
