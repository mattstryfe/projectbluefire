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
        <v-icon size="50" class="burning-blue-fire-intense flame-rotate-315 ml-n2">
          mdi-fire
        </v-icon>
      </v-app-bar-nav-icon>


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
  isHidden.value = currentScrollY > lastScrollY.value
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
</style>
