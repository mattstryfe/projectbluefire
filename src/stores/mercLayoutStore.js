import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'

// Merc app-shell UI state (MER-9): which fly-out is open and which background the stage shows.
// The bottom nav and view toggle call these actions directly, so there's no action bubbling
// through emits — one named home for the shell's interaction state.
export const useMercLayoutStore = defineStore('mercLayoutStore', () => {
  // null | 'showings' | 'post' | 'wallet' | 'me'
  const activeSheet = ref(null)
  // 'map' | 'list'
  const stageView = ref('map')

  // First-load cinematic fly-to (MER-26). The swoop replays on every entry/refresh (by design —
  // it's the wow moment), gated only by this sticky user preference (the Profile toggle). Lives in
  // the store, not MercMapCanvas, so the toggle persists across the canvas's remounts. localStorage.
  const introEnabled = useStorage('merc:intro-fly-to-enabled', true)

  // Fixed-height fly-out sheets (MER-18). OFF by default: sheet height varies with content (the
  // merc-fade transition smooths the size change). ON: every sheet is the same fixed height with a
  // pinned header + scrolling body. Persisted (localStorage).
  const fixedSheetSize = useStorage('merc:fixed-sheet-size', false)

  // Which bottom-nav destination reads as active. 'post' and 'map' both leave Map highlighted.
  const navSelection = computed(() =>
    ['showings', 'wallet', 'me'].includes(activeSheet.value) ? activeSheet.value : 'map'
  )

  function selectNavDestination(key) {
    // Map is the home canvas; tapping an already-open destination toggles it closed.
    activeSheet.value = key === 'map' || activeSheet.value === key ? null : key
  }

  function openPost() {
    activeSheet.value = activeSheet.value === 'post' ? null : 'post'
  }

  function closeActiveSheet() {
    activeSheet.value = null
  }

  function setStageView(next) {
    stageView.value = next
  }

  return {
    activeSheet,
    stageView,
    navSelection,
    selectNavDestination,
    openPost,
    closeActiveSheet,
    setStageView,
    introEnabled,
    fixedSheetSize
  }
})
