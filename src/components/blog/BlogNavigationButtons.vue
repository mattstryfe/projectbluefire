<template>
  <router-link
    v-if="currentMeta.previous_post"
    :to="`/blog/${currentMeta.previous_post.slug}`"
  >
    <v-card class="d-flex">
      <div class="d-flex">
        <v-img
          :src="currentMeta.previous_post.mainImageUrl"
          cover
          width="75"
          height="75"
        />
      </div>
      <div class="d-flex flex-column">
        <v-card-title class="my-0 py-0 text-amber-darken-2">
          {{ currentMeta.previous_post.title }}
        </v-card-title>
        <v-card-subtitle class="">
          {{ prevPublishedDate }}
        </v-card-subtitle>
      </div>
    </v-card>
  </router-link>

  <v-divider class="my-2 border-sm" />

  <router-link
    v-if="currentMeta.next_post"
    :to="`/blog/${currentMeta.next_post.slug}`"
  >
    <v-card class="d-flex">
      <div class="d-flex">
        <v-img
          :src="currentMeta.next_post.mainImageUrl"
          cover
          width="75"
          height="75"
        />
      </div>
      <div class="d-flex flex-column">
        <v-card-title class="my-0 py-0 text-amber-darken-2">
          {{ currentMeta.next_post.title }}
        </v-card-title>
        <v-card-subtitle class="">
          {{ nextPublishedDate }}
        </v-card-subtitle>
      </div>
    </v-card>
  </router-link>
</template>

<script setup>
import { useSanity } from '@/composables/useSanity'
import { computed, ref, watch } from 'vue'
import { metaQuery } from '@/components/blog/queries'
import dayjs from 'dayjs'

const currentMeta = ref({})
const { postPublishedAt } = defineProps({
  postPublishedAt: {
    type: String,
    default: ''
  }
})

const prevPublishedDate = computed(() =>
  dayjs(currentMeta.value.previous_post.publishedAt).format('MMM DD YYYY')
)
const nextPublishedDate = computed(() =>
  dayjs(currentMeta.value.next_post.publishedAt).format('MMM DD YYYY')
)

watch(
  () => postPublishedAt,
  async (publishedAt) => {
    if (!publishedAt) return

    const { data: metaData, fetchData: fetchMeta } = useSanity(metaQuery, {
      publishedAt
    })

    await fetchMeta()

    currentMeta.value = {
      previous_post: metaData.value.previous_post,
      next_post: metaData.value.next_post
    }
  },
  { immediate: true }
)
</script>

<style scoped></style>
