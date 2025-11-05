import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/plugins/firebase'
import { Geolocation } from '@capacitor/geolocation'

export const useUserStore = defineStore('userStore', () => {
  // State
  const showNavigationDrawer = ref(false)
  const userIsAuthenticated = ref(false)
  const accountMenu = ref(false)
  const userInfo = ref({})
  const hasProfileBeenRepaired = ref({})
  const userInfoKeysToTrack = ref([
    'displayName',
    'photoURL',
    'email',
    'enableAutoSave',
    'enableDarkMode'
  ])
  const zipcode = ref('')
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const getUserDisplayName = computed(() => userInfo.value.displayName)
  const getUserPhotoURL = computed(
    () =>
      userInfo.value.photoURL ||
      'https://randomuser.me/api/portraits/lego/1.jpg'
  )
  const getUserUid = computed(() => userInfo.value.uid)
  const getUserEmail = computed(() => userInfo.value.email)

  // Actions
  async function getUserLocation() {
    isLoading.value = true
    error.value = null

    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      })

      const { latitude, longitude } = position.coords

      // Reverse geocode to get city/state
      // const geoResponse = await fetch(
      //   `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      // )
      // const geoData = await geoResponse.json()

      location.value = {
        latitude,
        longitude
        // city:
        //   geoData.address.city ||
        //   geoData.address.town ||
        //   geoData.address.village ||
        //   'Unknown',
        // state: geoData.address.state || ''
      }

      console.log('location', location.value)
      // Save to localStorage
      localStorage.setItem('userLocation', JSON.stringify(location.value))

      return location.value
    } catch (err) {
      error.value = 'Failed to get location: ' + err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function nukeUserAccount() {
    accountMenu.value = false
    await deleteDoc(doc(db, 'users', getUserUid.value))
    userInfo.value = {}
    userIsAuthenticated.value = false
  }

  async function handleLogout() {
    accountMenu.value = false
    const auth = getAuth()
    await signOut(auth)
    userInfo.value = {}
    userIsAuthenticated.value = false
  }

  async function handleLogin(useTestAccount = false) {
    const auth = getAuth()
    let userDoc, authResponse

    if (useTestAccount) {
      const testEmail = import.meta.env.VITE_TEST_USER_EMAIL
      const testPassword = import.meta.env.VITE_TEST_USER_PASSWORD
      authResponse = await signInWithEmailAndPassword(
        auth,
        testEmail,
        testPassword
      )
    } else {
      const provider = new GoogleAuthProvider()
      authResponse = await signInWithPopup(auth, provider)
    }

    try {
      userDoc = await getDoc(doc(db, 'users', authResponse.user.uid))

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

      userIsAuthenticated.value = true

      userDoc = await getDoc(doc(db, 'users', authResponse.user.uid))
      userInfo.value = userDoc.data()
    } catch (e) {
      console.log('no worky', e)
    }
  }

  return {
    // State
    showNavigationDrawer,
    userIsAuthenticated,
    accountMenu,
    userInfo,
    hasProfileBeenRepaired,
    userInfoKeysToTrack,
    isLoading,

    // Getters
    getUserDisplayName,
    getUserPhotoURL,
    getUserUid,
    getUserEmail,

    // Actions
    getUserLocation,
    nukeUserAccount,
    handleLogout,
    handleLogin
  }
})
