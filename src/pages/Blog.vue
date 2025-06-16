<template>
  <v-row class="mt-5">
    <template v-if="isLoading">
      <v-col v-for="i in 6" :key="i" cols="4">
        <v-skeleton-loader
          class="v-card ma-1 pa-1 border-sm w-100"
          height="300"
          type="card-avatar, article"
        />
      </v-col>
    </template>
    <template v-if="!isLoading">
      <BlogPostCard
        v-for="post in posts"
        :key="post._id"
        :post="post"
        :post-slug="post.slug"
      ></BlogPostCard>
    </template>
  </v-row>
</template>

<script setup>
import { onMounted } from 'vue'
import BlogPostCard from '@/components/blog/BlogPostCard.vue'
import { useSanity } from '@/composables/useSanity'
import { mainQuery } from '@/components/blog/queries'

const { data: posts, isLoading, fetchData } = useSanity(mainQuery)

onMounted(async () => {
  await fetchData()
})
</script>

<style scoped></style>
