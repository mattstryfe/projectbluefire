import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth'
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/plugins/firebase'
import { Geolocation } from '@capacitor/geolocation'
import {
  getCoordsFromZip,
  getLocalityInfoFromCoords,
  getWeatherUrlsForThisZipcode
} from '@/services/googleServices.js'
import { useWeatherDataStore } from '@/stores/weatherDataStore.js'
import { useNotificationStore } from '@/stores/notificationStore.js'
import { GEO_FRESHNESS_MS, GEO_POSITION_TIMEOUT_MS, MAX_ZIP_HISTORY } from '@/config/appDefaults.js'

export const useUserStore = defineStore('userStore', () => {
  const showNavigationDrawer = ref(false)
  const userIsAuthenticated = ref(false)
  const accountMenu = ref(false)
  const userInfo = ref({})
  const hasProfileBeenRepaired = ref({})
  const isGettingLocation = ref(false)
  const error = ref(null)
  const userGeoCoords = ref(null)
  // TODO: TG-74: schema change → LocationRecord { placeId, displayLabel, lat, lng, city, state, zipcode?, timestamp }; Firestore doc key changes from zipcode → placeId (lazy migration on login)
  const savedLocations = ref([])
  // TODO: TG-74: rename → failedLocations, key by placeId instead of zipcode string
  const failedZipcodes = ref(new Set())
  const jtwViewChoice = ref('card')

  // Getters
  const getUserDisplayName = computed(() => userInfo.value.displayName)
  const getUserPhotoURL = computed(
    () => userInfo.value.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'
  )
  const getUserUid = computed(() => userInfo.value.uid)
  const getUserEmail = computed(() => userInfo.value.email)
  /* Writable computed so components can use storeToRefs + v-model directly without
     needing a local get/set computed wrapper. The setter handles the Firestore write,
     so there's no risk of a component updating UI state while silently skipping persistence. */
  const enablePlacesAutocomplete = computed({
    get: () => userInfo.value.enablePlacesAutocomplete ?? false,
    set: (val) => setEnablePlacesAutocomplete(val)
  })

  const detailedPrecipitation = computed({
    get: () => userInfo.value.detailedPrecipitation ?? true,
    set: (val) => setDetailedPrecipitation(val)
  })

  /* Resolves a manually entered zip to coords using a 3-layer cache:
     savedLocations (localStorage + merged Firebase) → Google API on miss.
     loadZipHistoryFromFirebase merges Firebase into savedLocations on login,
     so a single find() here covers all cached layers without separate lookups. */
  async function getUserLocationUsingManualZipcode(zipcodeEnteredByUser) {
    const cached = savedLocations.value.find((loc) => loc.zipcode === zipcodeEnteredByUser)
    if (cached) {
      userGeoCoords.value = { ...cached, isUserLocation: true, type: 'manual' }
      return
    }

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
    saveLocationToHistory(userGeoCoords.value)
  }

  function isGeoLocationStale() {
    return (
      !userGeoCoords.value?.timestamp ||
      Date.now() - userGeoCoords.value.timestamp >= GEO_FRESHNESS_MS
    )
  }

  async function getUserLocation() {
    isGettingLocation.value = true
    error.value = null

    const { addNotification, removeNotification } = useNotificationStore()
    const gettingId = addNotification({
      message: 'Getting your location...',
      color: 'info',
      icon: 'mdi-crosshairs-gps'
    })

    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: GEO_POSITION_TIMEOUT_MS
      })

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

      saveLocationToHistory(userGeoCoords.value)
      // Sync the resolved zip back to the input field so it reflects the auto-detected location
      useWeatherDataStore().zipcodeTextFieldValue = zipcode

      removeNotification(gettingId)
      addNotification({
        message: `Location found: ${city}, ${state}`,
        color: 'success',
        icon: 'mdi-check-circle-outline',
        timeout: 4000
      })
    } catch (err) {
      removeNotification(gettingId)
      addNotification({
        message: 'Could not get your location',
        color: 'error',
        icon: 'mdi-alert-circle-outline',
        timeout: 5000
      })
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

  /* Runs on startup after loadSavedLocations. Backfills missing fields from older
     schema versions and removes any entry that fails NWS validation (bad coords,
     non-US zip, or outside NWS coverage). Uses failedZipcodes as the shared failure
     registry — weatherDataStore also writes to it to prevent retry on known bad zips. */
  async function repairSavedLocations() {
    for (const loc of savedLocations.value) {
      // Backfill missing city/state from older saves
      if (!loc.city || !loc.state) {
        try {
          const { city, state } = await getLocalityInfoFromCoords(loc.lat, loc.lng)
          loc.city = city
          loc.state = state
        } catch {
          console.warn(`Could not repair location ${loc.zipcode} — removing`)
          failedZipcodes.value.add(loc.zipcode)
          continue
        }
      }

      // Validate NWS coverage
      try {
        await getWeatherUrlsForThisZipcode(loc.lat, loc.lng)
      } catch {
        console.warn(`No NWS coverage for ${loc.zipcode} — removing`)
        failedZipcodes.value.add(loc.zipcode)
      }
    }

    const beforeCount = savedLocations.value.length
    savedLocations.value = savedLocations.value.filter((loc) => !failedZipcodes.value.has(loc.zipcode))
    if (savedLocations.value.length !== beforeCount) {
      localStorage.setItem('savedLocations', JSON.stringify(savedLocations.value))
    }
  }

  /* Writes a resolved location to localStorage and Firebase (fire-and-forget on Firebase
     so it never blocks the forecast load). Caps history at MAX_ZIP_HISTORY by evicting
     the oldest entries — sort ensures we keep the most recently used, not most recently added. */
  function saveLocationToHistory(locationData) {
    const exists = savedLocations.value?.some((loc) => loc.zipcode === locationData.zipcode)
    if (exists) return

    const entry = {
      lat: locationData.lat,
      lng: locationData.lng,
      zipcode: locationData.zipcode,
      city: locationData.city ?? null,
      state: locationData.state ?? null,
      timestamp: Date.now()
    }

    savedLocations.value.push(entry)

    if (savedLocations.value.length > MAX_ZIP_HISTORY) {
      savedLocations.value.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      savedLocations.value = savedLocations.value.slice(0, MAX_ZIP_HISTORY)
    }

    localStorage.setItem('savedLocations', JSON.stringify(savedLocations.value))

    if (userIsAuthenticated.value && getUserUid.value) {
      setDoc(doc(db, 'users', getUserUid.value, 'zipHistory', entry.zipcode), entry).catch((err) =>
        console.warn('Failed to sync zip to Firebase:', err)
      )
    }
  }

  /* Merges Firebase zip history into savedLocations on login, giving the manual zip
     lookup a single cache to check that implicitly covers both localStorage and cloud history. */
  async function loadZipHistoryFromFirebase() {
    if (!getUserUid.value) return
    try {
      const snapshot = await getDocs(collection(db, 'users', getUserUid.value, 'zipHistory'))
      snapshot.forEach((docSnap) => {
        const data = docSnap.data()
        const exists = savedLocations.value.some((loc) => loc.zipcode === data.zipcode)
        if (!exists) savedLocations.value.push(data)
      })
      savedLocations.value.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      localStorage.setItem('savedLocations', JSON.stringify(savedLocations.value))
    } catch (err) {
      console.warn('Failed to load zip history from Firebase:', err)
    }
  }

  // TODO: TG-74: signature changes — accepts placeId instead of zipcode string; Firestore path changes from zipHistory/{zipcode} → zipHistory/{placeId}
  function removeLocationFromLocalStorage(zipcode) {
    savedLocations.value = savedLocations.value.filter((loc) => loc.zipcode !== zipcode)
    failedZipcodes.value.delete(zipcode)
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations.value))
    if (userIsAuthenticated.value && getUserUid.value) {
      deleteDoc(doc(db, 'users', getUserUid.value, 'zipHistory', zipcode)).catch((err) =>
        console.warn('Failed to remove zip from Firebase:', err)
      )
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

  async function processAuthResponse(authResponse) {
    const { uid, displayName, photoURL, email } = authResponse.user
    const userRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid,
        enableAutoSave: false,
        enableDarkMode: false,
        enablePlacesAutocomplete: false,
        detailedPrecipitation: true
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
    loadZipHistoryFromFirebase()
  }

  async function setEnablePlacesAutocomplete(value) {
    userInfo.value.enablePlacesAutocomplete = value
    if (getUserUid.value) {
      updateDoc(doc(db, 'users', getUserUid.value), { enablePlacesAutocomplete: value }).catch(
        (err) => console.warn('Failed to save Places Autocomplete preference:', err)
      )
    }
  }

  async function setDetailedPrecipitation(value) {
    userInfo.value.detailedPrecipitation = value
    if (getUserUid.value) {
      updateDoc(doc(db, 'users', getUserUid.value), { detailedPrecipitation: value }).catch(
        (err) => console.warn('Failed to save Detailed Precipitation preference:', err)
      )
    }
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

  // Load saved locations, then repair any stale entries in the background
  loadSavedLocations()
  repairSavedLocations()

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
    failedZipcodes,
    jtwViewChoice,

    // Getters
    getUserDisplayName,
    getUserPhotoURL,
    getUserUid,
    getUserEmail,
    enablePlacesAutocomplete,
    detailedPrecipitation,

    // Actions
    isGeoLocationStale,
    getUserLocationUsingManualZipcode,
    getUserLocation,
    nukeUserAccount,
    handleLogout,
    handleLogin,
    removeLocationFromLocalStorage,
    setEnablePlacesAutocomplete
  }
})
