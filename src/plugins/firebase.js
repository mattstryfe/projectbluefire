// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: 'project-bluefire',
  storageBucket: "project-bluefire.appspot.com",
  messagingSenderId: "342995548873",
  appId: "1:342995548873:web:1c76e4fc07b8623e2c2b18"
};

// Initialize Firebase
const baseApp = initializeApp(firebaseConfig)

// auth
//initialize firebase auth
// const auth = getAuth()
// console.log('auth', auth)

// db
const db = getFirestore(baseApp)

export default db
