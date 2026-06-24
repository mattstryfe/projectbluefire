// Merc (merc-alpha) Firebase web config — a separate Firebase project from BlueFire (ADR-005).
// These are public Firebase web-client identifiers (apiKey included), not secrets — they ship
// in the browser bundle by design, so they're inlined here rather than injected via env/CI.
// Access is enforced by Firestore rules + App Check, not by hiding these values.
export const mercFirebaseConfig = {
  apiKey: 'AIzaSyAEoaO4hlx1_9IjBqX4JsCsvv7QuPkOWys',
  authDomain: 'merc-alpha.firebaseapp.com',
  projectId: 'merc-alpha',
  storageBucket: 'merc-alpha.firebasestorage.app',
  messagingSenderId: '996590738116',
  appId: '1:996590738116:web:26fa104d48fe094f954791'
}
