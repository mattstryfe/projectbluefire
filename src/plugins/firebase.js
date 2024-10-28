// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://project-bluefire.firebaseio.com",
  projectId: 'project-bluefire',
  storageBucket: "project-bluefire.appspot.com",
  messagingSenderId: "342995548873",
  appId: "1:342995548873:web:1c76e4fc07b8623e2c2b18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// db
const db = getFirestore(app)

export { db }
