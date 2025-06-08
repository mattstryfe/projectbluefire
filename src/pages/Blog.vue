<template>
  <v-row class="mt-5">
    <BlogPostCard
      v-for="post in posts"
      :key="post.slug"
      :post-slug="post.slug"
    ></BlogPostCard>
  </v-row>
</template>

<script setup>
import { useSanityBlogStore } from '@/stores/sanityBlogStore'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import BlogPostCard from '@/components/blog/BlogPostCard.vue'

const sanityBlogStore = useSanityBlogStore()
// const { fetchPosts } = butterStore
// const { posts } = storeToRefs(butterStore)
onMounted(async () => {
  // await fetchPosts()
  console.log('posts', posts)
})
</script>

<style scoped></style>
