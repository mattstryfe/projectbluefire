<template>
  <transition-group tag="div" name="toast" class="toast-stack">
    <v-alert
      v-for="toast in notifications"
      :key="toast.id"
      @click:close="removeNotification(toast.id)"
      :color="toast.color"
      :icon="toast.icon ?? undefined"
      border="start"
      rounded="lg"
      density="compact"
      variant="tonal"
      closable
      class="toast-item"
    >
      {{ toast.message }}
    </v-alert>
  </transition-group>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
const { removeNotification } = notificationStore
</script>

<style scoped>
.toast-stack {
  position: fixed;
  bottom: calc(72px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: min(340px, 88vw);
}

@media (min-width: 600px) {
  .toast-stack {
    bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  }
}

.toast-item {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
}

.toast-enter-active {
  transition: all 0.25s ease-out;
}

.toast-leave-active {
  transition: opacity 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.toast-leave-to {
  opacity: 0;
}
</style>
