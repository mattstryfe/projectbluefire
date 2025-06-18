<template>
  <v-app-bar
    app
    rounded
    density="compact"
    v-scroll="onScroll"
    :style="{
      transform: isHidden ? 'translateY(-50%)' : 'translateY(0%)'
    }"
  >
    <template v-if="!isHidden" #prepend>
      <v-app-bar-nav-icon
        @click.stop="showNavigationDrawer = !showNavigationDrawer"
        variant="text"
      ></v-app-bar-nav-icon>
      <v-divider vertical />
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
      <h4 @click="router.push('/')" class="mb-n1 cursor-pointer ml-0 pl-">
        Project
        <span class="text-blue-lighten-1">Bluefire</span>
      </h4>
    </template>

    <template v-if="!isHidden" #append>
      <main-user-account-menu></main-user-account-menu>
    </template>
  </v-app-bar>
</template>

<script setup>
import MainUserAccountMenu from '@/components/navigation/MainUserAccountMenu.vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'

const { showNavigationDrawer } = storeToRefs(useUserStore())
const router = useRouter()

const isHidden = ref(false) // Controls hiding behavior
const lastScrollY = ref(0) // Tracks last scroll position

// Mimic `v-app-bar` scroll behavior
const onScroll = () => {
  const currentScrollY = window.scrollY
  isHidden.value = currentScrollY > lastScrollY.value || currentScrollY > 0
  lastScrollY.value = currentScrollY
}
</script>

<style scoped>
/* Smooth transition */
.v-app-bar {
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
  will-change: transform, opacity; /* Boost performance */
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
