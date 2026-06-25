import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'

// Merc app-shell UI state (MER-9): which fly-out is open and which background the stage shows.
// The bottom nav and view toggle call these actions directly, so there's no action bubbling
// through emits — one named home for the shell's interaction state.
export const useMercShellStore = defineStore('mercShellStore', () => {
  // null | 'showings' | 'post' | 'wallet' | 'me'
  const activeSheet = ref(null)
  // 'map' | 'list'
  const view = ref('map')

  // First-load cinematic fly-to (MER-26). The swoop replays on every entry/refresh (by design —
  // it's the wow moment), gated only by this sticky user preference (the Profile toggle). Lives in
  // the store, not MercMapCanvas, so the toggle persists across the canvas's remounts. localStorage.
  const introEnabled = useStorage('merc:intro-fly-to-enabled', true)

  // Which bottom-nav destination reads as active. 'post' and 'map' both leave Map highlighted.
  const navSelection = computed(() =>
    ['showings', 'wallet', 'me'].includes(activeSheet.value) ? activeSheet.value : 'map'
  )

  function select(key) {
    // Map is the home canvas; tapping an already-open destination toggles it closed.
    activeSheet.value = key === 'map' || activeSheet.value === key ? null : key
  }

  function openPost() {
    activeSheet.value = activeSheet.value === 'post' ? null : 'post'
  }

  function close() {
    activeSheet.value = null
  }

  function setView(next) {
    view.value = next
  }

  return {
    activeSheet,
    view,
    navSelection,
    select,
    openPost,
    close,
    setView,
    introEnabled
  }
})
