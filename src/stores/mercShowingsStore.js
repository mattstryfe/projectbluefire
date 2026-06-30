import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore.js'
import { useMercAuthStore } from '@/stores/mercAuthStore'
import * as showingsWorker from '@/workers/mercShowingsWorker.js'

// Thin Pinia store for Merc showings (MER-14): owns ONLY the vue-y reactive flags and injects
// store-derived deps (notifications) into mercShowingsWorker, which holds the actual Firestore /
// geolocation logic. Per the project rule, the worker never imports a store — the store passes in
// what it needs. `postShowing` is the reusable post path; MER-20 (drop-a-pin) calls it too.
export const useMercShowingsStore = defineStore('mercShowingsStore', () => {
  const isPosting = ref(false)
  const isGettingLocation = ref(false)

  // Live query results. The worker owns the onSnapshot setup; the store just holds the reactive
  // results + the unsubscribe handles (kept off the reactive surface as plain module-scoped vars).
  // mapShowings = open marketplace in the current map bounds; myShowings = everything I participate
  // in (any status), for the bottom sheet.
  const mapShowings = ref([])
  const myShowings = ref([])
  let mapUnsub = null
  let myUnsub = null

  // My-showings tracks the CURRENT agent. Auth is the single producer of uid and showings depend on
  // it (correct dependency direction), so the store reacts to uid here — one leaf reaction covering
  // the dev switcher, the real sign-in modal, and sign-out alike (no per-call-site threading).
  const mercAuthStore = useMercAuthStore()

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

  // ── Live subscriptions ──────────────────────────────────────────────────────────────────────
  // MAP feed is re-bounded as the user pans/zooms — starting again tears the old listeners down
  // first. MY-SHOWINGS feed is driven by the auth watch below, not by the sheet's lifecycle.
  function startMapSubscription({ center, radiusM }, { onData } = {}) {
    const { addNotification } = useNotificationStore()
    stopMapSubscription()
    mapUnsub = showingsWorker.subscribeOpenShowingsInBounds(
      { center, radiusM },
      {
        onChange: (rows) => {
          mapShowings.value = rows // reactive state (filters / badges / debug read this)
          onData?.(rows) // explicit, direct drive of the imperative (non-reactive) Mapbox render
        },
        onError: (e) =>
          addNotification({
            message: `Map didn't load: ${e?.message ?? 'query failed'}`,
            color: 'error',
            icon: 'mdi-map-marker-alert-outline',
            timeout: null
          })
      }
    )
  }

  function stopMapSubscription() {
    if (mapUnsub) {
      mapUnsub()
      mapUnsub = null
    }
  }

  function startMyShowingsSubscription() {
    stopMyShowingsSubscription()
    const uid = mercAuthStore.getUserUid
    if (!uid) {
      myShowings.value = [] // signed out — nothing is "mine"
      return
    }
    const { addNotification } = useNotificationStore()
    myUnsub = showingsWorker.subscribeMyShowings(uid, {
      onChange: (rows) => {
        myShowings.value = rows
      },
      onError: (e) =>
        addNotification({
          message: `Couldn't load your showings: ${e?.message ?? 'query failed'}`,
          color: 'error',
          icon: 'mdi-alert-circle-outline',
          timeout: null
        })
    })
  }

  function stopMyShowingsSubscription() {
    if (myUnsub) {
      myUnsub()
      myUnsub = null
    }
  }

  // (Re)subscribe my-showings whenever the signed-in agent changes — start on login, restart on a
  // switch, clear on sign-out. immediate covers the initial auth state once it resolves.
  watch(
    () => mercAuthStore.getUserUid,
    (uid) => (uid ? startMyShowingsSubscription() : stopMyShowingsSubscription()),
    { immediate: true }
  )

  return {
    isPosting,
    isGettingLocation,
    mapShowings,
    myShowings,
    postShowing,
    getCurrentLocation,
    startMapSubscription,
    stopMapSubscription,
    startMyShowingsSubscription,
    stopMyShowingsSubscription
  }
})
