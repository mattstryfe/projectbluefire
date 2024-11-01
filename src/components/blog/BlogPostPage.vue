<template>
  <v-row>
    <v-card-subtitle>
      {{ publishedDate }} |
      <span class="text-amber-darken-2">{{ post.author.first_name }}</span>
    </v-card-subtitle>
    <v-card-title class="text-amber-darken-2">
      {{ post.title }}
    </v-card-title>
    <v-card-text v-html="post.body"></v-card-text>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import { useButterStore } from '@/stores/butterStore'
import dayjs from 'dayjs'

const { postSlug } = defineProps({
  postSlug: {
    type: String,
    required: true,
    default: ''
  }
})
const butterStore = useButterStore()
const post = computed(() => butterStore.getPostBySlug(postSlug))
const publishedDate = computed(() =>
  dayjs(post.value.published).format('MMM DD YY')
)

console.log('post', post)
</script>

<style scoped></style>
