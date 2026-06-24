// BlueFire's default Firebase app — the repo's primary app. Merc work must NOT use these
// exports; it has its own named secondary app in src/plugins/mercFirebase.js (ADR-005).
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from '@/configs/firebaseConfig'

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export { app }
