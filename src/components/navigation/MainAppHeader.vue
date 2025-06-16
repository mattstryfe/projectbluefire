<template>
  <v-app-bar :elevation="2" rounded class="cust-o pr-2" density="compact">
    <template #prepend>
      <v-app-bar-nav-icon
        @click.stop="showNavigationDrawer = !showNavigationDrawer"
        variant="text"
      ></v-app-bar-nav-icon>

      <v-btn
        @click="router.push('/')"
        icon="mdi-fire"
        size="60"
        variant="plain"
        class="ml-n2"
      >
        <v-icon
          size="50"
          class="mdi-rotate-315 burning-blue-fire-intense"
        ></v-icon>
      </v-btn>
      <h4 @click="router.push('/')" class="mb-n1 cursor-pointer">
        Project
        <span class="text-blue-lighten-1">Bluefire</span>
      </h4>
    </template>

    <template #append>
      <waffle-menu></waffle-menu>
      <main-user-account-menu></main-user-account-menu>
    </template>
  </v-app-bar>
</template>

<script setup>
import WaffleMenu from '@/components/navigation/MainWaffleMenu.vue'
import MainUserAccountMenu from '@/components/navigation/MainUserAccountMenu.vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'

const { showNavigationDrawer } = storeToRefs(useUserStore())
const router = useRouter()
</script>

<style scoped>
:deep(.v-toolbar__content) {
  overflow: visible !important;
}

.burning-blue-fire-intense {
  animation: blueFireIntense 5s ease-in-out infinite;
}

@keyframes blueFireIntense {
  0% {
    color: #90caf9; /* Very light blue */
    filter: drop-shadow(0 0 2px rgba(144, 202, 249, 0.5));
    transform: scale(1);
  }
  50% {
    color: #2196f3; /* Medium blue */
    filter: drop-shadow(0 0 10px rgba(33, 150, 243, 0.8));
    transform: scale(1.1);
  }
  100% {
    color: #90caf9; /* Very light blue */
    filter: drop-shadow(0 0 2px rgba(144, 202, 249, 0.5));
    transform: scale(1);
  }
}
</style>
