<template>
  <v-app-bar
    app
    rounded
    v-scroll="onScroll"
    :style="{
      transform: isHidden ? 'translateY(-50%)' : 'translateY(0%)'
    }"
  >
    <template v-if="!isHidden" #prepend>
      <v-app-bar-nav-icon @click="router.push('/')">
        <v-icon size="50" class="mdi-rotate-315 burning-blue-fire-intense ml-n2">
          mdi-fire
        </v-icon>
      </v-app-bar-nav-icon>

      <v-divider vertical class="ml-1"/>

      <h4 v-if="!isJtwPage" @click="router.push('/')" class="mb-4 ml-2 cursor-pointer">
        Project
        <span class="text-blue-lighten-1">Bluefire</span>
      </h4>
    </template>

    <zipcode-toolbar v-if="!isHidden && isJtwPage" class="flex-grow-0"/>

    <template v-if="!isHidden" #append>
      <main-user-account-menu></main-user-account-menu>
    </template>
  </v-app-bar>
</template>

<script setup>
import MainUserAccountMenu from '@/components/navigation/MainUserAccountMenu.vue'
import ZipcodeToolbar from '@/components/jtw/ZipcodeToolbar.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, computed } from 'vue'

const router = useRouter()
const route = useRoute()

const isJtwPage = computed(() => route.name === 'Just The Weather (JTW)')

const isHidden = ref(false)
const lastScrollY = ref(0)

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
