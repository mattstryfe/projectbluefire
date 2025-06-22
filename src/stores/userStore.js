import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCredential,
  signOut
} from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/plugins/firebase'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'

export const useUserStore = defineStore('userStore', () => {
  const showNavigationDrawer = ref(false)
  const userIsAuthenticated = ref(false)
  const accountMenu = ref(false)
  const userInfo = ref({})
  const hasProfileBeenRepaired = ref({})
  const userInfoKeysToTrack = [
    'displayName',
    'photoURL',
    'email',
    'enableAutoSave',
    'enableDarkMode'
  ]
  const result = ref({})

  const getUserDisplayName = computed(() => userInfo.value.displayName)
  const getUserPhotoURL = computed(
    () =>
      userInfo.value.photoURL ||
      'https://randomuser.me/api/portraits/lego/1.jpg'
  )
  const getUserUid = computed(() => userInfo.value.uid)
  const getUserEmail = computed(() => userInfo.value.email)

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

    try {
      if (useTestAccount) {
        const testEmail = import.meta.env.VITE_TEST_USER_EMAIL
        const testPassword = import.meta.env.VITE_TEST_USER_PASSWORD
        authResponse = await signInWithEmailAndPassword(
          auth,
          testEmail,
          testPassword
        )
      } else if (Capacitor.isNativePlatform()) {
        await SocialLogin.initialize({
          google: {
            // https://console.firebase.google.com/u/0/project/project-bluefire/authentication/providers
            webClientId:
              '342995548873-g7smu4i2e082aku2j6rb4ksc3uvokn14.apps.googleusercontent.com'
          }
        })
        console.log('in here...')
        result.value = await SocialLogin.login({ provider: 'google' })

        console.log('result', result.value.result.idToken)
        if (!result.value) {
          console.log('[Login] Canceled or failed.')
          return
        }

        const credential = GoogleAuthProvider.credential(
          result.value.result.idToken
        )
        authResponse = await signInWithCredential(auth, credential)
      } else {
        const provider = new GoogleAuthProvider()
        authResponse = await signInWithPopup(auth, provider)
      }

      const uid = authResponse.user.uid
      userDoc = await getDoc(doc(db, 'users', uid))

      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', uid), {
          displayName: authResponse.user.displayName,
          photoURL: authResponse.user.photoURL,
          email: authResponse.user.email,
          uid,
          enableAutoSave: false,
          enableDarkMode: false
        })
      }

      userIsAuthenticated.value = true
      userDoc = await getDoc(doc(db, 'users', uid))
      userInfo.value = userDoc.data()
    } catch (e) {
      const isCancel =
        e.message?.toLowerCase().includes('cancel') ||
        e.message?.includes('popup closed') ||
        e.code === 'auth/popup-closed-by-user'

      if (isCancel) {
        console.log('[Login] Cancelled by user.')
        return
      }

      console.error('[Login] Failed:', e)
    }
  }

  return {
    // state
    showNavigationDrawer,
    userIsAuthenticated,
    accountMenu,
    userInfo,
    hasProfileBeenRepaired,
    userInfoKeysToTrack,
    result,

    // getters
    getUserDisplayName,
    getUserPhotoURL,
    getUserUid,
    getUserEmail,

    // actions
    nukeUserAccount,
    handleLogout,
    handleLogin
  }
})
