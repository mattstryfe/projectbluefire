import { defineStore } from 'pinia'
import { useDisplay } from 'vuetify'
import { computed } from 'vue'

export const useLayoutStore = defineStore('layoutStore', () => {
  const display = useDisplay() // Vuetify's responsive composable

  // Computed getters
  const smAndUp = computed(() => display.smAndUp.value)
  const mdAndUp = computed(() => display.mdAndUp.value)

  return {
    smAndUp,
    mdAndUp
  }
})
