import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore.js'
import * as showingsWorker from '@/workers/mercShowingsWorker.js'

// Thin Pinia store for Merc showings (MER-14): owns ONLY the vue-y reactive flags and injects
// store-derived deps (notifications) into mercShowingsWorker, which holds the actual Firestore /
// geolocation logic. Per the project rule, the worker never imports a store — the store passes in
// what it needs. `postShowing` is the reusable post path; MER-20 (drop-a-pin) calls it too.
export const useMercShowingsStore = defineStore('mercShowingsStore', () => {
  const isPosting = ref(false)
  const isGettingLocation = ref(false)

  async function postShowing(payload) {
    const { addNotification } = useNotificationStore()
    isPosting.value = true
    try {
      return await showingsWorker.postShowing({ notify: addNotification }, payload)
    } finally {
      isPosting.value = false
    }
  }

  async function getCurrentLocation() {
    const { addNotification, removeNotification } = useNotificationStore()
    isGettingLocation.value = true
    try {
      return await showingsWorker.getCurrentLocation({
        notify: addNotification,
        removeNotify: removeNotification
      })
    } finally {
      isGettingLocation.value = false
    }
  }

  return { isPosting, isGettingLocation, postShowing, getCurrentLocation }
})
