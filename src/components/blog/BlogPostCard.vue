<template>
  <v-col sm="4" md="3" cols="12">
    <v-card @click="router.push('blog/' + postSlug)" border>
      <v-img cover :src="post.featured_image" height="200"></v-img>
      <v-card-subtitle>
        {{ publishedDate }} |
        <span class="text-amber-darken-2">{{ post.author.first_name }}</span>
      </v-card-subtitle>
      <v-card-title class="text-amber-darken-2">
        {{ post.title }}
      </v-card-title>
      <v-card-subtitle>
        {{ post.summary || '...' }}
      </v-card-subtitle>
    </v-card>
  </v-col>
</template>

<script setup>
import { computed } from 'vue'
import { useButterStore } from '@/stores/butterStore'
import dayjs from 'dayjs'
import router from '@/plugins/router'
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
  dayjs(post.value.published).format('MMM DD YYYY')
)
</script>

<style scoped></style>
