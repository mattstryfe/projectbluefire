// Merc (merc-alpha) Firebase web config — a separate Firebase project from BlueFire (ADR-005).
// API key + identifiers are read from import.meta.env (real values live in the gitignored
// .env.local), mirroring src/plugins/firebase.js. projectId/storageBucket are non-sensitive
// public identifiers, so they're inlined.
export const mercFirebaseConfig = {
  apiKey: import.meta.env.VITE_MERC_API_KEY,
  authDomain: import.meta.env.VITE_MERC_AUTH_DOMAIN,
  projectId: 'merc-alpha',
  storageBucket: 'merc-alpha.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_MERC_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_MERC_APP_ID
}
