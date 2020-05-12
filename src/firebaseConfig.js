import firebase from "firebase"

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: "project-bluefire.appspot.com",
  messagingSenderId: "342995548873",
  appId: "1:342995548873:web:1c76e4fc07b8623e2c2b18"
};

export default firebase.initializeApp(firebaseConfig);
