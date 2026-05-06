import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  let nextId = 0

  function addNotification({ message, color = 'info', icon = null, timeout = 5000 }) {
    const id = nextId++
    notifications.value.push({ id, message, color, icon })
    if (timeout !== null) {
      setTimeout(() => removeNotification(id), timeout)
    }
    return id
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) notifications.value.splice(index, 1)
  }

  return { notifications, addNotification, removeNotification }
})
