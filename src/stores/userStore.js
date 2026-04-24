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
import { getCoordsFromZip, getLocalityInfoFromCoords } from '@/services/googleServices.js'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'

export const useUserStore = defineStore('userStore', () => {
  const showNavigationDrawer = ref(false)
  const userIsAuthenticated = ref(false)
  const accountMenu = ref(false)
  const userInfo = ref({})
  const hasProfileBeenRepaired = ref({})
  const isGettingLocation = ref(false)
  const error = ref(null)
  const userGeoCoords = ref(null)
  const savedLocations = ref([])
  const jtwViewChoice = ref('card')

  // Getters
  const getUserDisplayName = computed(() => userInfo.value.displayName)
  const getUserPhotoURL = computed(
    () => userInfo.value.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'
  )
  const getUserUid = computed(() => userInfo.value.uid)
  const getUserEmail = computed(() => userInfo.value.email)

  async function getUserLocationUsingManualZipcode(zipcodeEnteredByUser) {
    const { lat, lng, city, state } = await getCoordsFromZip(zipcodeEnteredByUser)
    userGeoCoords.value = {
      lat,
      lng,
      zipcode: zipcodeEnteredByUser,
      city,
      state,
      timestamp: Date.now(),
      isUserLocation: true,
      type: 'manual'
    }

    // add them to local storage
    addLocationToLocalStorage(userGeoCoords.value)
  }

  const GEO_FRESHNESS_MS = 5 * 60 * 1000

  function isGeoLocationStale() {
    return (
      !userGeoCoords.value?.timestamp ||
      Date.now() - userGeoCoords.value.timestamp >= GEO_FRESHNESS_MS
    )
  }

  async function getUserLocation() {
    isGettingLocation.value = true
    error.value = null

    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      })

      // Now get zipcode from Google
      const { zipcode, city, state } = await getLocalityInfoFromCoords(
        position.coords.latitude,
        position.coords.longitude
      )

      userGeoCoords.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        zipcode,
        city,
        state,
        timestamp: Date.now(),
        isUserLocation: true,
        type: 'auto'
      }

      // Also add to saved locations list
      addLocationToLocalStorage(userGeoCoords.value)

      // Update input box with auto user location
      useWeatherDataStore().zipcodeTextFieldValue = zipcode
    } catch (err) {
      error.value = 'Failed to get location: ' + err.message
      throw err
    } finally {
      isGettingLocation.value = false
    }
  }

  // Initialize from localStorage
  function loadSavedLocations() {
    const cached = localStorage.getItem('savedLocations')
    if (cached) {
      try {
        savedLocations.value = JSON.parse(cached)
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        console.warn('Invalid saved locations data')
        savedLocations.value = []
      }
    }
  }

  // Add a new location
  function addLocationToLocalStorage(locationData) {
    // Check if zipcode already exists
    const exists = savedLocations.value?.some((loc) => loc.zipcode === locationData.zipcode)

    if (!exists) {
      savedLocations.value.push({
        lat: locationData.lat,
        lng: locationData.lng,
        zipcode: locationData.zipcode,
        city: locationData.city,
        state: locationData.state,
        timestamp: Date.now()
      })

      // Sync to localStorage
      localStorage.setItem('savedLocations', JSON.stringify(savedLocations.value))
    }
  }

  // Remove a location by zipcode
  function removeLocationFromLocalStorage(zipcode) {
    savedLocations.value = savedLocations.value.filter((loc) => loc.zipcode !== zipcode)
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations.value))
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

  async function processAuthResponse(authResponse) {
    const { uid, displayName, photoURL, email } = authResponse.user
    const userRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid,
        enableAutoSave: false,
        enableDarkMode: false
      })
    }

    // Always use Firebase Auth for identity fields — they are kept fresh by Google.
    // Only Firestore is used for app-specific preferences.
    userInfo.value = {
      ...(userDoc.exists() ? userDoc.data() : {}),
      uid,
      displayName,
      photoURL,
      email
    }
    userIsAuthenticated.value = true
  }

  async function handleLogin(useTestAccount = false) {
    const auth = getAuth()

    try {
      let authResponse

      if (useTestAccount) {
        const testEmail = import.meta.env.VITE_TEST_USER_EMAIL
        const testPassword = import.meta.env.VITE_TEST_USER_PASSWORD
        authResponse = await signInWithEmailAndPassword(auth, testEmail, testPassword)
      } else {
        const provider = new GoogleAuthProvider()
        authResponse = await signInWithPopup(auth, provider)
      }

      await processAuthResponse(authResponse)
    } catch (e) {
      if (e.code === 'auth/cancelled-popup-request' || e.code === 'auth/popup-closed-by-user') {
        return
      }
      console.error('Login error:', e)
    }
  }


  loadSavedLocations()

  return {
    // State
    showNavigationDrawer,
    userIsAuthenticated,
    accountMenu,
    userInfo,
    hasProfileBeenRepaired,
    isGettingLocation,
    userGeoCoords,
    savedLocations,
    jtwViewChoice,

    // Getters
    getUserDisplayName,
    getUserPhotoURL,
    getUserUid,
    getUserEmail,

    // Actions
    isGeoLocationStale,
    getUserLocationUsingManualZipcode,
    getUserLocation,
    nukeUserAccount,
    handleLogout,
    handleLogin,
    removeLocationFromLocalStorage
  }
})
