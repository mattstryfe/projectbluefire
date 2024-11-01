<template>
  <v-row>
    <v-col cols="12">
      <v-card v-if="isDoneLoading" border class="">
        <v-card-subtitle>
          {{ publishedDate }} |
          <span class="text-amber-darken-2">{{ post.author.first_name }}</span>
        </v-card-subtitle>
        <br>
        <v-card-title class="text-amber-darken-2">
          {{ post.title }}
        </v-card-title>
        <v-card-text v-html="post.body"></v-card-text>
      </v-card>
    </v-col>


  </v-row>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useButterStore } from '@/stores/butterStore'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'

const route = useRoute()
const butterStore = useButterStore()
const { postSlug } = defineProps({
  postSlug: {
    type: String,
    required: true,
    default: ''
  }
})
const post = ref({})
const isDoneLoading = ref(false)

/* If the user is navigating directly to this URL they dont have prop slugggggs
but they DO have a beforeEnter .meta value which is attached in routerLinkSchema.js */
onMounted(async () => {
  if (route.meta.isDirectAccess) {
    await butterStore.fetchPosts()
    post.value = butterStore.getPostBySlug(route.params.postSlug)
    isDoneLoading.value = true
  } else {
    post.value = butterStore.getPostBySlug(postSlug)
    isDoneLoading.value = true
  }
})

const publishedDate = computed(() =>
  dayjs(post.value.published).format('MMM DD YY')
)
</script>

<style scoped></style>
