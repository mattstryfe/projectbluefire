<template>
  <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const pathParts = route.path.split('/').filter((part) => part)
  let fullPath = ''

  return [
    { title: 'Home', to: '/' },
    ...pathParts.map((part) => {
      fullPath += `/${part}`
      return {
        title: part.charAt(0).toUpperCase() + part.slice(1),
        to: fullPath
      }
    })
  ]
})
</script>
