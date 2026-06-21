import { defineStore } from 'pinia'
import { ref } from 'vue'

// Placeholder Merc auth store. Merc has its OWN auth store — never read BlueFire's userStore
// for Merc auth (MERC.md / ADR-005). Built out in MER-7 against the dedicated Merc Firebase
// app instance: getAuth(mercApp), onAuthStateChanged, Google + email/password, DEV auto-login.
export const useMercAuthStore = defineStore('mercAuthStore', () => {
  const userIsAuthenticated = ref(false)
  const userInfo = ref({})

  // TODO: MER-7: wire multi-provider auth against the named Merc Firebase app instance.

  return {
    userIsAuthenticated,
    userInfo
  }
})
