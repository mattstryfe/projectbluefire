<template>
  <v-col sm="4" md="3" cols="12">
    <v-card @click="router.push('/blog/' + postSlug)" variant="flat">
      <v-img cover :src="post.mainImageUrl" height="200"></v-img>
      <v-card-subtitle>
        {{ publishedDate }} |
        <span class="text-amber-darken-2">{{ post.author.name }}</span>
      </v-card-subtitle>
      <v-card-title class="text-amber-darken-2">
        {{ post.title }}
      </v-card-title>
      <v-card-subtitle>
        {{ post.preview }}
      </v-card-subtitle>
    </v-card>
  </v-col>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import router from '@/plugins/router'

const { postSlug, post } = defineProps({
  post: {
    type: Object,
    default: () => ({})
  },
  postSlug: {
    type: String,
    required: true,
    default: ''
  }
})

const publishedDate = computed(() => {
  console.log('post', post)
  return dayjs(post.publishedAt).format('MMM DD YYYY')
})
</script>
