import { computed,ref } from 'vue'

import { defineStore } from 'pinia'

import { useNotificationStore } from '@/stores/notificationStore.js'

import { mercAuth } from '@/plugins/mercFirebase'

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth'

// Merc's OWN auth store — scoped to the named 'merc' Firebase app (ADR-005). User-facing
// sign-in is Google + email/password (surfaced via the top-bar sign-in modal). Never reads
// BlueFire's userStore.
export const useMercAuthStore = defineStore('mercAuthStore', () => {
  const userInfo = ref({})
  const token = ref(null)
  const userIsAuthenticated = ref(false)

  const getUserUid = computed(() => userInfo.value.uid)
  const getUserEmail = computed(() => userInfo.value.email)
  const getUserDisplayName = computed(() => userInfo.value.displayName)

  // Resolves once Firebase reports the initial auth state. The MER-8 route guard awaits this
  // so it never decides before a persisted session is rehydrated on a fresh page load.
  let resolveAuthReady
  const authReady = new Promise((resolve) => {
    resolveAuthReady = resolve
  })

  function notifyError(e) {
    if (e?.code === 'auth/cancelled-popup-request' || e?.code === 'auth/popup-closed-by-user') return
    console.error('[merc] auth error:', e)
    const { addNotification } = useNotificationStore()
    addNotification({
      message: `Merc sign-in failed: ${e?.message ?? e?.code ?? 'unknown error'}`,
      color: 'error',
      icon: 'mdi-alert-circle-outline',
      timeout: 6000
    })
  }

  async function applyUser(user) {
    if (user) {
      const { uid, displayName, photoURL, email } = user
      token.value = await user.getIdToken()
      userInfo.value = { uid, displayName, photoURL, email }
      userIsAuthenticated.value = true
      // TODO: MER-13: create/load the agent profile doc (agents/{uid}) on first login.
    } else {
      token.value = null
      userInfo.value = {}
      userIsAuthenticated.value = false
    }
  }

  async function signInWithGoogle() {
    try {
      // TODO: MER-: native Capacitor Google sign-in (FirebaseAuthentication scoped to the merc
      // app) is deferred — needs the merc-alpha Android app + SHA-1 first.
      await signInWithPopup(mercAuth, new GoogleAuthProvider())
      return true
    } catch (e) {
      notifyError(e)
      return false
    }
  }

  async function signInWithEmail(email, password) {
    try {
      await signInWithEmailAndPassword(mercAuth, email, password)
      return true
    } catch (e) {
      notifyError(e)
      return false
    }
  }

  async function registerWithEmail(email, password) {
    try {
      await createUserWithEmailAndPassword(mercAuth, email, password)
      return true
    } catch (e) {
      notifyError(e)
      return false
    }
  }

  async function signOutMerc() {
    try {
      await signOut(mercAuth)
      await applyUser(null)
    } catch (e) {
      notifyError(e)
    }
  }

  // Refresh-persistence: Firebase restores the session, onAuthStateChanged re-hydrates state.
  onAuthStateChanged(mercAuth, async (user) => {
    await applyUser(user)
    resolveAuthReady(userIsAuthenticated.value)
  })

  // DEV convenience only: auto-login with the merc-alpha test account. Uses email/password
  // because Google's popup can't fire without a user gesture. Mirrors BlueFire's
  // handleLogin(true), but scoped to Merc and triggered here so main.js stays untouched.
  if (import.meta.env.DEV) {
    authReady.then((isAuthed) => {
      if (isAuthed) return
      const email = import.meta.env.VITE_MERC_TEST_USER_EMAIL
      const password = import.meta.env.VITE_MERC_TEST_USER_PASSWORD
      if (email && password) {
        console.info('[merc] dev auto-login as', email)
        signInWithEmailAndPassword(mercAuth, email, password).catch(notifyError)
      } else {
        console.warn('[merc] dev auto-login skipped — set VITE_MERC_TEST_USER_EMAIL / VITE_MERC_TEST_USER_PASSWORD in .env.local')
      }
    })
  }

  return {
    // state
    userInfo,
    token,
    userIsAuthenticated,
    // getters
    getUserUid,
    getUserEmail,
    getUserDisplayName,
    // auth-ready signal (awaited by the MER-8 guard)
    authReady,
    // actions
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    signOutMerc
  }
})
