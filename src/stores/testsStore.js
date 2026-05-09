import { defineStore } from 'pinia'
import { useNotificationStore } from '@/stores/notificationStore.js'

export const useTestsStore = defineStore('tests', () => {
  function spawnTestToasts() {
    const n = useNotificationStore()
    n.addNotification({ message: 'Info -- this one persists', color: 'info', icon: 'mdi-information', timeout: null })
    n.addNotification({ message: 'Success -- this one persists', color: 'success', icon: 'mdi-check-circle-outline', timeout: null })
    n.addNotification({ message: 'Error -- this one persists', color: 'error', icon: 'mdi-alert-circle-outline', timeout: null })
  }

  return { spawnTestToasts }
})
