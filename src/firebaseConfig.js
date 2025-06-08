// treeshaking to reduce firebase size across app.
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: 'https://project-bluefire.firebaseio.com',
  projectId: 'project-bluefire',
  storageBucket: "project-bluefire.appspot.com",
  messagingSenderId: "342995548873",
  appId: "1:342995548873:web:1c76e4fc07b8623e2c2b18"
};

const baseApp = initializeApp(firebaseConfig)
const db = getFirestore(baseApp)
export default db
