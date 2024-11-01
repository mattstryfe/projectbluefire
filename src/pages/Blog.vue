<template>
  <v-row class="mt-5">
    <BlogPostCard v-for="post in posts" :key="post.slug" :post-slug="post.slug"></BlogPostCard>
  </v-row>
</template>

<script setup>
import { useButterStore } from '@/stores/butterStore'
import { onMounted } from 'vue'
import {storeToRefs} from "pinia";
import BlogPostCard from "@/components/blog/BlogPostCard.vue";

const butterStore = useButterStore()
const { fetchPosts } = butterStore
const { posts, loading, error } = storeToRefs(butterStore);
onMounted(async () => {
  await fetchPosts()
  console.log('posts', posts)
})
</script>

<style scoped></style>
