// BlueFire (project-bluefire) Firebase web config — the repo's default Firebase app.
// These are public Firebase web-client identifiers (apiKey included), not secrets — they ship
// in the browser bundle by design, so they're inlined here rather than injected via env/CI.
// Access is enforced by Firestore rules + App Check, not by hiding these values.
export const firebaseConfig = {
  apiKey: 'AIzaSyDbIkYI9S9F7WP1VY0ayEaYPGOnC3oqH48',
  authDomain: 'project-bluefire.firebaseapp.com',
  databaseURL: 'https://project-bluefire.firebaseio.com',
  projectId: 'project-bluefire',
  storageBucket: 'project-bluefire.appspot.com',
  messagingSenderId: '342995548873',
  appId: '1:342995548873:web:1c76e4fc07b8623e2c2b18'
}
