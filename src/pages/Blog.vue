<template>
  <h4>Blog</h4>
  number of posts:{{ posts.length }}
  {{ posts }}
</template>

<script setup>
import { useButterStore } from '@/stores/butterStore'
import { onMounted, ref } from 'vue'
import {storeToRefs} from "pinia";

const butterStore = useButterStore()
const { fetchPosts } = butterStore
const { posts, loading, error } = storeToRefs(butterStore);
onMounted(async () => {
  await fetchPosts()
  console.log('posts', posts)
})
</script>

<style scoped></style>
