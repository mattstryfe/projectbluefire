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
import {
  getCoordsFromZip,
  getZipFromCoords
} from '@/services/googleServices.js'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'

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
  const isLoading = ref(false)
  const error = ref(null)
  const userGeoCoords = ref(null)
  const savedLocations = ref([])

  // Getters
  const getUserDisplayName = computed(() => userInfo.value.displayName)
  const getUserPhotoURL = computed(
    () =>
      userInfo.value.photoURL ||
      'https://randomuser.me/api/portraits/lego/1.jpg'
  )
  const getUserUid = computed(() => userInfo.value.uid)
  const getUserEmail = computed(() => userInfo.value.email)

  async function getUserLocationUsingManualZipcode(zipcodeEnteredByUser) {
    const { lat, lng } = await getCoordsFromZip(zipcodeEnteredByUser)
    userGeoCoords.value = {
      lat,
      lng,
      zipcode: zipcodeEnteredByUser,
      timestamp: Date.now(),
      isUserLocation: true,
      type: 'manual'
    }

    // add them to local storage
    addLocationToLocalStorage(userGeoCoords.value)
  }

  async function getUserLocation() {
    isLoading.value = true
    error.value = null

    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      })

      // Now get zipcode from Google
      const zipcode = await getZipFromCoords(
        position.coords.latitude,
        position.coords.longitude
      )

      userGeoCoords.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        zipcode,
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
      isLoading.value = false
    }
  }

  // Initialize from localStorage
  function loadSavedLocations() {
    const cached = localStorage.getItem('savedLocations')
    if (cached) {
      try {
        savedLocations.value = JSON.parse(cached)
      } catch (err) {
        console.warn('Invalid saved locations data')
        savedLocations.value = []
      }
    }
  }

  // Add a new location
  function addLocationToLocalStorage(locationData) {
    // Check if zipcode already exists
    const exists = savedLocations.value?.some(
      (loc) => loc.zipcode === locationData.zipcode
    )

    if (!exists) {
      savedLocations.value.push({
        lat: locationData.latitude,
        lng: locationData.longitude,
        zipcode: locationData.zipcode,
        timestamp: Date.now()
      })

      // Sync to localStorage
      localStorage.setItem(
        'savedLocations',
        JSON.stringify(savedLocations.value)
      )
    }
  }

  // Remove a location by zipcode
  function removeLocationFromLocalStorage(zipcode) {
    savedLocations.value = savedLocations.value.filter(
      (loc) => loc.zipcode !== zipcode
    )
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

  loadSavedLocations()

  return {
    // State
    showNavigationDrawer,
    userIsAuthenticated,
    accountMenu,
    userInfo,
    hasProfileBeenRepaired,
    userInfoKeysToTrack,
    isLoading,
    userGeoCoords,
    savedLocations,

    // Getters
    getUserDisplayName,
    getUserPhotoURL,
    getUserUid,
    getUserEmail,

    // Actions
    getUserLocationUsingManualZipcode,
    getUserLocation,
    nukeUserAccount,
    handleLogout,
    handleLogin,
    removeLocationFromLocalStorage
  }
})
