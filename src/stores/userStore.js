import { defineStore } from 'pinia'
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/plugins/firebase'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userIsAuthenticated: false,
    accountMenu: false,
    userInfo: {},
    hasProfileBeenRepaired: {},  // empty but truthy.  Important for loader to have 3 states
    userInfoKeysToTrack: ['displayName', 'photoURL', 'email', 'enableAutoSave', 'enableDarkMode']
  }),

  getters: {
    // ?. is used to prevent logout from throwing console errors for now.
    getUserDisplayName: (state) => state.userInfo.displayName,
    getUserPhotoURL: (state) => state.userInfo.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
    getUserUid: (state) => state.userInfo.uid,
    getUserEmail: (state) => state.userInfo.email,
  },

  actions: {
    async nukeUserAccount() {
      // Hide menu because it de-populates during logout
      this.accountMenu = false

      await deleteDoc(doc(db, 'users', this.getUserUid))
      this.userInfo = {}
      this.userIsAuthenticated = false
    },
    async handleLogout() {
      // Hide menu because it de-populates during logout
      this.accountMenu = false
      const auth = getAuth()
      await signOut(auth)
      this.userInfo = {}
      this.userIsAuthenticated = false
    },
    async handleLogin(useTestAccount = false) {
      const auth = getAuth()
      let userDoc, authResponse

      if (useTestAccount) {
        const testEmail = import.meta.env.VITE_TEST_USER_EMAIL;
        const testPassword = import.meta.env.VITE_TEST_USER_PASSWORD;
        authResponse = await signInWithEmailAndPassword(auth, testEmail, testPassword)
      }
      else {
        const provider = new GoogleAuthProvider()
        //initialize firebase auth
        authResponse = await signInWithPopup(auth, provider)
        // Pull this outside scope to use as SoT
      }

      try {
        userDoc = await getDoc(doc(db, 'users', authResponse.user.uid))
        // If user entry DOESN'T exists, make it
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', authResponse.user.uid), {
            displayName: authResponse.user.displayName,
            photoURL: authResponse.user.photoURL,
            email: authResponse.user.email,
            uid: authResponse.user.uid,
            enableAutoSave: false,
            enableDarkMode: false
          })
        }

        this.userIsAuthenticated = true

        // Get the doc now...
        userDoc = await getDoc(doc(db, 'users', authResponse.user.uid))
        // Always get userData from the stored doc, even if it's being created right now.
        // Update the store with this value so all components who depend on it, pull from here
        // and updating happens seamlessly.
        this.userInfo = userDoc.data()
      }
      catch (e) {
        console.log('no worky', e)
      }
    }
  }
})
