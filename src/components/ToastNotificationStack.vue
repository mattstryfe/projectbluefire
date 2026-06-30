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

/* On the Merc shell (/merc/app) the bottom nav + its raised center (+) FAB are present at ANY width,
   so toasts must clear them — this overrides both breakpoints above (two-class specificity wins).
   App.vue adds the class on the Merc route only, so BlueFire's positioning is untouched. Full
   top-reposition is MER-31. */
.toast-stack.toast--merc {
  bottom: calc(100px + env(safe-area-inset-bottom, 0px));
}

.toast-item {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
}

.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.25s ease-in;
  position: absolute;
}

.toast-move {
  transition: transform 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.93);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
