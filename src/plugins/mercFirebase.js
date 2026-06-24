// Merc's dedicated Firebase app — initialized as a NAMED secondary app ('merc') so it stays
// fully separate from BlueFire's default app (ADR-005). Every Merc getAuth/getFirestore must
// use these exports — never BlueFire's src/plugins/firebase.js or userStore.
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { mercFirebaseConfig } from '@/configs/mercFirebaseConfig'

const mercApp = initializeApp(mercFirebaseConfig, 'merc')

export const mercAuth = getAuth(mercApp)
export const mercDb = getFirestore(mercApp)
export { mercApp }
