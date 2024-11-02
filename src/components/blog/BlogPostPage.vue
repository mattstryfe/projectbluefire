<template>
  <v-row>
    <Breadcrumbs></Breadcrumbs>
    <v-col cols="12">
      <v-card v-if="!isLoading" border>
        <v-img :src="currentPost.featured_image" max-height="300" cover></v-img>
        <v-card-subtitle>
          {{ publishedDate }} |
          <span class="text-amber-darken-2">
            {{ currentPost.author.first_name }}
          </span>
        </v-card-subtitle>

        <v-card-title class="text-amber-darken-2 text-h3">
          {{ currentPost.title }}
        </v-card-title>
        <v-card-text class="" v-html="currentPost.body"></v-card-text>

        <!-- Previous & Next Navigation -->
        <v-row class="pa-1">
          <v-col cols="5" class="align-center justify-center d-flex">
            <router-link
              v-if="currentMeta.previous_post"
              :to="`/blog/${currentMeta.previous_post.slug}`"
            >
              << {{ currentMeta.previous_post.title }}
            </router-link>
          </v-col>

          <v-col cols="5" class="align-center justify-center d-flex">
            <router-link
              v-if="currentMeta.next_post"
              :to="`/blog/${currentMeta.next_post.slug}`"
            >
              {{ currentMeta.next_post.title }} >>
            </router-link>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useButterStore } from '@/stores/butterStore'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { storeToRefs } from 'pinia'

const route = useRoute()
const butterStore = useButterStore()
const { currentPost, currentMeta, isLoading } = storeToRefs(butterStore)
// const isDoneLoading = ref(false)

/* If the user is navigating directly to this URL they dont have prop slugggggs
but they DO have a beforeEnter .meta value which is attached in routerLinkSchema.js
Should be noted... Only have to do this because I am not re-querying individual posts using
fetchPost.  Arguably would be better to use that pattern over this.

One thing i just realized is that if i redid the query here, i would be able to more cleany
obtain the .meta information for the next/previous buttons...

Additionally, it looks like the meta information gets out of sync with the app if you
use the pattern I'm currently using.  It is unaware of the post you are on and because of this
contains null/undefined entries for next/previous and even some other pertinent info
*/

const publishedDate = computed(() =>
  dayjs(currentPost.value.published).format('MMM DD YYYY')
)

watch(
  () => route.params.postSlug,
  async (slug) => await butterStore.fetchPost(slug),
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
