// Merc Firestore data model — the single source of truth for Phase 1 entity shapes.
// Every downstream Merc ticket (MER-11…21) reads/writes against these schemas, so the
// shapes here are load-bearing. Zod validates documents at the app boundary; Firestore
// itself is schemaless.
//
// Standing rules baked in here (see MERC.md and the ADR doc):
//   • brokerageId on every core doc that belongs to a brokerage (ADR-005, multi-tenancy).
//     The Brokerage doc is the exception — its own doc id (brokerages/{id}) IS the
//     brokerageId, so it carries no redundant field. The Property is the second exception
//     (property-as-root, ADR-007): a physical thing is brokerage-agnostic.
//   • The ledger is append-only and immutable (ADR-002): entries have createdAt but no
//     updatedAt, and there is no update/delete path anywhere in the codebase. Hard
//     enforcement lands in MER-11 (Security Rules) + MER-21 (Cloud Function writer).
//   • Verification fields are modeled now but left as empty slots — richer values arrive
//     with broker-manager approval (Phase 1) and Stripe Connect KYC (Phase 4) (ADR-004).
//   • Property-as-root (ADR-007): a Property is the durable anchor; Listings and Showings
//     hang off it via an opaque `propertyId`; the agent is a mutable field, never the
//     anchor. Soft-delete via `archived` (never hard-delete money/audit data, ADR-002).
//
// Pure module: imports only `zod` (no '@/' alias, no import.meta.env) so it is importable
// from both the Vite app and plain Node seed/verify scripts.

import { z } from 'zod'

// ── Firestore collection names ───────────────────────────────────────────────
// Centralized so scoped queries (MER-14/18) and the seed/verify scripts share one source.
export const MERC_COLLECTIONS = {
  brokerages: 'brokerages',
  agents: 'agents',
  properties: 'properties',
  listings: 'listings',
  showings: 'showings',
  ledger: 'ledger'
}

// Per-showing PII subcollection. Client contact lives at showings/{id}/private/contact — NOT on the
// showing doc — so it never rides the bulk map stream (browsable unauthenticated, MER-8) and Rules can
// gate it independently (MER-11 intent: any authenticated agent in the same brokerageId). See
// showingContactSchema below.
export const MERC_SHOWING_PRIVATE_SUBCOLLECTION = 'private'
export const MERC_SHOWING_CONTACT_DOC_ID = 'contact'

// ── Enum source-of-truth ─────────────────────────────────────────────────────
// Plain arrays so UI/forms can import the same lists the schemas validate against.
export const AGENT_ROLES = ['broker_manager', 'agent']
export const MEMBERSHIP_STATUSES = ['pending', 'approved', 'denied']
// `cancelled` and `expired` added per ADR-007 (property-as-root). The legal-transition table
// + force-cancel authority are enforced in MER-11 (Rules) / MER-15 (claim behavior).
export const SHOWING_STATUSES = ['draft', 'open', 'claimed', 'in_progress', 'completed', 'settled', 'cancelled', 'expired']
export const LEDGER_ENTRY_TYPES = ['pool_funded', 'allocation', 'allocation_returned', 'promise', 'settlement']

// ── Shared field validators ──────────────────────────────────────────────────

// Accepts the several shapes a Firestore timestamp legitimately takes: a JS Date, a
// Timestamp (read-back: { seconds, nanoseconds } / toDate() / toMillis()), the
// serverTimestamp() FieldValue sentinel (write-time), or an ISO date string. The server
// owns the final value, so this validates shape/presence, not correctness.
function isFirestoreTimestamp(value) {
  if (value instanceof Date) return true
  if (typeof value === 'string') return value.length > 0 && !Number.isNaN(Date.parse(value))
  if (typeof value === 'object' && value !== null) {
    if (typeof value.seconds === 'number') return true // Timestamp read shape / Timestamp.now()
    if (typeof value.toMillis === 'function' || typeof value.toDate === 'function') return true
    if (typeof value._methodName === 'string') return true // FieldValue sentinel internals
    const ctor = value.constructor && value.constructor.name
    if (typeof ctor === 'string' && ctor.includes('FieldValue')) return true // serverTimestamp()
  }
  return false
}

const firestoreTimestamp = z.custom(isFirestoreTimestamp, {
  message: 'Expected a Firestore timestamp (Date, Timestamp, serverTimestamp(), or ISO string)'
})

const brokerageId = z.string().min(1, 'brokerageId is required')
// Virtual money for Phase 1 (ADR-002); real Stripe Connect funds arrive at Phase 4. The
// record shape stays the same throughout. `.finite()` rejects NaN/Infinity.
const money = z.number().finite()

// ── Brokerage — brokerages/{id} ──────────────────────────────────────────────
// The doc id is the brokerageId; no redundant field (see header note).
export const brokerageSchema = z.strictObject({
  name: z.string().min(1),
  address: z.string().min(1),
  contactEmail: z.email(),
  contactPhone: z.string().min(1),
  // Cached running total derived from the ledger — convenience, never the source of
  // truth. The ledger is authoritative (ADR-002).
  poolBalance: money,
  createdAt: firestoreTimestamp,
  updatedAt: firestoreTimestamp
})

// ── Agent — agents/{uid} ─────────────────────────────────────────────────────
// Doc id matches the Firebase Auth uid (also stored as a field for query convenience).
export const agentSchema = z.strictObject({
  uid: z.string().min(1),
  brokerageId,
  displayName: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1).nullable().default(null),
  photoURL: z.url().nullable().default(null),
  role: z.enum(AGENT_ROLES),
  // Verification slots — modeled now, populated later (ADR-004). Left empty until
  // broker-manager approval (Phase 1) / Stripe Connect KYC (Phase 4) fill them in.
  verificationStatus: z.string().nullable().default(null),
  verificationMethod: z.string().nullable().default(null),
  membershipStatus: z.enum(MEMBERSHIP_STATUSES),
  createdAt: firestoreTimestamp,
  updatedAt: firestoreTimestamp
})

// ── Property — properties/{id} ───────────────────────────────────────────────
// The durable physical anchor (property-as-root, ADR-007). Listings and Showings hang off it
// via propertyId. The doc id is an OPAQUE Firestore auto-id — never a semantic key; duplicate
// docs for the same address are tolerated until a deferred janitor merge. Brokerage-agnostic
// (a physical thing) — the deliberate second brokerageId exception alongside the brokerage doc.
// Match-hints (mapboxPlaceId/normalizedAddress/geohash/apn) are best-effort dedup aids filled by
// geocode when available; a miss is null and never blocks a write.
export const propertySchema = z.strictObject({
  address: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  mlsLink: z.url().nullable().optional(),
  mapboxPlaceId: z.string().nullable().default(null),
  normalizedAddress: z.string().nullable().default(null),
  geohash: z.string().nullable().default(null),
  apn: z.string().nullable().default(null),
  archived: z.boolean().default(false),
  createdAt: firestoreTimestamp,
  updatedAt: firestoreTimestamp
})

// ── Listing — listings/{id} ──────────────────────────────────────────────────
// The representation relationship — an agent/brokerage represents a property (ADR-007). Tenant-
// scoped (carries brokerageId). Hello-world stub for property-as-root: no Listing-create flow
// ships in Phase 1 (MER-14/MER-20 post with listingId:null), so this shape is forward-prep for
// the Listings surface. No status enum — soft-delete via `archived` only (a Listing has no
// scheduledAt/client/allocation; that is why listings and showings are two collections).
export const listingSchema = z.strictObject({
  propertyId: z.string().min(1),
  brokerageId,
  postingAgentId: z.string().min(1),
  archived: z.boolean().default(false),
  createdAt: firestoreTimestamp,
  updatedAt: firestoreTimestamp
})

// ── Showing — showings/{id} ──────────────────────────────────────────────────
// The marketplace job (ADR-007): an appointment to show a property to a client, posted for
// coverage. Hangs off a Property via propertyId; listingId is null for a drop-a-pin post. The
// agent is a mutable field, never the anchor.
export const showingSchema = z.strictObject({
  brokerageId,
  propertyId: z.string().min(1), // opaque ref to properties/{id}
  listingId: z.string().min(1).nullable().default(null), // null = drop-a-pin (no listing)
  postingAgentId: z.string().min(1), // the poster (renamed from listingAgentId per ADR-007)
  claimingAgentId: z.string().min(1).nullable().default(null), // null until claimed
  // posted ∪ claimed, denormalized for the "My Showings" array-contains query. Starts
  // [postingAgentId]; claimer appended on claim, removed on force-cancel. Never null.
  participantIds: z.array(z.string().min(1)).min(1),
  status: z.enum(SHOWING_STATUSES),
  // Denormalized property snapshot for map/card reads (logical single-source-of-truth, ADR-007).
  property: z.strictObject({
    address: z.string().min(1),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    mlsLink: z.url().nullable().optional() // optional manual MLS link (Phase 2)
  }),
  // Computed from lat/lng (geofire-common) — drives the map bounds query (MER-18). Non-nullable
  // whenever coords exist, so a missing geohash can't make a pin invisible.
  geohash: z.string().min(1),
  // client PII (name/email/phone) intentionally NOT here — it lives in the private/contact
  // subcollection (showingContactSchema) so it stays off the bulk map stream (MER-18 design).
  scheduledAt: firestoreTimestamp,
  allocation: money.nonnegative(), // promised amount, virtual money
  archived: z.boolean().default(false),
  createdAt: firestoreTimestamp,
  updatedAt: firestoreTimestamp
})

// ── Showing client contact — showings/{id}/private/contact (PII subcollection) ───────────────
// Client PII lives here, NOT on the showing doc, so it never rides the bulk map stream (which may be
// browsed unauthenticated, MER-8) and Rules can gate it on its own. Read access (MER-11 intent): any
// authenticated agent in the same brokerageId — coverage requires contacting the client, and that
// trust is brokerage-scoped, not per-agent. brokerageId is denormalized here so a Rule can authorize
// the read without an extra get() on the parent showing. Written atomically with the showing (MER-14).
export const showingContactSchema = z.strictObject({
  brokerageId,
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1)
})

// ── Ledger entry — ledger/{id} ───────────────────────────────────────────────
// IMMUTABLE, append-only (ADR-002): created once, never updated or deleted. Note the
// deliberate absence of updatedAt — there is intentionally no path to mutate a ledger
// entry. showingId/agentId are nullable because a pool_funded entry has neither.
// Runtime writes are owned by the MER-21 Cloud Function, never client-direct.
export const ledgerEntrySchema = z.strictObject({
  brokerageId,
  showingId: z.string().min(1).nullable().default(null),
  agentId: z.string().min(1).nullable().default(null),
  type: z.enum(LEDGER_ENTRY_TYPES),
  amount: money, // signed: negative for deductions, positive for additions
  description: z.string().min(1),
  createdAt: firestoreTimestamp
})

// Convenience map: collection name → schema (used by the verify/seed scripts and any
// future generic validate-before-write helper).
export const MERC_SCHEMAS = {
  [MERC_COLLECTIONS.brokerages]: brokerageSchema,
  [MERC_COLLECTIONS.agents]: agentSchema,
  [MERC_COLLECTIONS.properties]: propertySchema,
  [MERC_COLLECTIONS.listings]: listingSchema,
  [MERC_COLLECTIONS.showings]: showingSchema,
  [MERC_COLLECTIONS.ledger]: ledgerEntrySchema
}
