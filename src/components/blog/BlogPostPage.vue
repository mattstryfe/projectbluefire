<template>
  <v-row>
    <v-col class="pa-0 ma-0">
      <Breadcrumbs></Breadcrumbs>
    </v-col>
    <v-col cols="12">
      <v-card v-if="!postIsLoading" border height="" class="d-flex flex-column">
        <v-img :src="currentPost.mainImageUrl" max-height="200" cover></v-img>
        <v-card-subtitle>
          {{ publishedDate }} |
          <span class="text-amber-darken-2">
            {{ currentPost.author.name }}
          </span>
        </v-card-subtitle>

        <v-card-title class="text-amber-darken-2">
          {{ currentPost.title }}
        </v-card-title>
        <v-card-text>
          <PortableText :value="currentPost.body" />
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card class="border-sm pa-2">
        <BlogNavigationButtons :post-published-at="currentPost.publishedAt" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'
import { useSanity } from '@/composables/useSanity'
import { PortableText } from '@portabletext/vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import BlogNavigationButtons from '@/components/blog/BlogNavigationButtons.vue'
import { postQuery } from '@/components/blog/queries'
const route = useRoute()
const currentPost = ref({})
const postIsLoading = ref(true)
const publishedDate = computed(() =>
  dayjs(currentPost.value.published).format('MMM DD YYYY')
)
watch(
  () => route.params.postSlug,
  async (slug) => {
    console.log('slug', slug)
    const {
      data: post,
      isLoading,
      fetchData
    } = useSanity(postQuery, { slug: slug })

    await fetchData()

    // Assign values
    currentPost.value = post.value

    // Done loading
    postIsLoading.value = isLoading.value
  },

  { immediate: true }
)
</script>

<style scoped>
:deep(.v-card-text p) {
  margin-bottom: 1.5em;
}
:deep(.v-card-text ul) {
  margin-left: 1.5em;
  margin-bottom: 1em;
}
:deep(.v-card-text *) {
  color: darkgrey;
}
</style>
