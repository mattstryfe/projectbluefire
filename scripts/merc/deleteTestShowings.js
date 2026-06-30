// One-shot cleanup for merc-alpha: deletes the stray MER-14 verification docs — every `showings`
// and `properties` doc, plus each showing's `private/contact` PII subdoc — so the map starts clean
// for MER-18. This is the home for repeatable merc data migrations; future hierarchy edits get a
// sibling script here rather than ad-hoc console clicks.
//
// merc-alpha Firestore is open test-mode (rules harden in MER-11), so the public web config is
// enough — no service account needed. mercFirebaseConfig + mercDataSchema are pure modules (no '@/'
// alias, no import.meta.env), so they import straight into Node.
//
// Usage:  node scripts/merc/deleteTestShowings.js --yes
// Guard:  refuses to run without --yes so it can't nuke data by accident.
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { mercFirebaseConfig } from '../../src/configs/mercFirebaseConfig.js'
import {
  MERC_COLLECTIONS,
  MERC_SHOWING_PRIVATE_SUBCOLLECTION,
  MERC_SHOWING_CONTACT_DOC_ID
} from '../../src/configs/mercDataSchema.js'

if (!process.argv.includes('--yes')) {
  console.log('Refusing to run without --yes.\nUsage: node scripts/merc/deleteTestShowings.js --yes')
  process.exit(1)
}

const app = initializeApp(mercFirebaseConfig)
const db = getFirestore(app)

async function deleteCollection(name, beforeDelete) {
  const snap = await getDocs(collection(db, name))
  let n = 0
  for (const d of snap.docs) {
    if (beforeDelete) await beforeDelete(d)
    await deleteDoc(d.ref)
    n++
  }
  console.log(`Deleted ${n} doc(s) from ${name}`)
  return n
}

// Deleting a doc does NOT cascade to its subcollections, so drop the known PII subdoc first. Old
// (pre-split) showings have no contact subdoc — deleteDoc on a missing path is a no-op, so this is
// safe across both shapes.
await deleteCollection(MERC_COLLECTIONS.showings, (d) =>
  deleteDoc(doc(db, MERC_COLLECTIONS.showings, d.id, MERC_SHOWING_PRIVATE_SUBCOLLECTION, MERC_SHOWING_CONTACT_DOC_ID))
)
await deleteCollection(MERC_COLLECTIONS.properties)

console.log('merc-alpha cleanup complete.')
process.exit(0)
