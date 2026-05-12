<template>
  <transition-group tag="div" name="toast" class="toast-stack">
    <v-alert
      v-for="toast in notifications"
      :key="toast.id"
      @click:close="removeNotification(toast.id)"
      :color="toast.color"
      :icon="toast.icon ?? undefined"
      density="compact"
      variant="tonal"
      closable
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
/* TODO: TG-66: hardcoded bottom offset may not account for safe-area-inset-bottom on some devices */
.toast-stack {
  position: fixed;
  bottom: 72px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: min(420px, 92vw);
}

@media (min-width: 600px) {
  .toast-stack {
    bottom: 24px;
  }
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
