<template>
  <v-row>
    <!-- Previous Post -->
    <v-col cols="6" class="pr-2" v-if="currentMeta.previous_post">
      <v-card
        variant="flat"
        :to="`/blog/${currentMeta.previous_post.slug}`"
        hover
        class="h-100 pa-3"
      >
        <v-img
          :src="currentMeta.previous_post.mainImageUrl"
          cover
          height="120"
          class="rounded mb-3"
        />

        <v-card-subtitle class="text-caption text-medium-emphasis pa-0 mb-2">
          {{ prevPublishedDate }}
        </v-card-subtitle>

        <v-card-title
          class="text-body-2 text-amber-darken-2 font-weight-medium pa-0"
        >
          {{ currentMeta.previous_post.title }}
        </v-card-title>
      </v-card>
    </v-col>

    <!-- Next Post -->
    <v-col
      :cols="currentMeta.previous_post ? 6 : 12"
      :class="currentMeta.previous_post ? 'pl-2' : ''"
      v-if="currentMeta.next_post"
    >
      <v-card
        variant="flat"
        :to="`/blog/${currentMeta.next_post.slug}`"
        hover
        class="h-100 pa-3"
      >
        <v-img
          :src="currentMeta.next_post.mainImageUrl"
          cover
          height="120"
          class="rounded mb-3"
        />

        <v-card-subtitle class="text-caption text-medium-emphasis pa-0 mb-2">
          {{ nextPublishedDate }}
        </v-card-subtitle>

        <v-card-title
          class="text-body-2 text-amber-darken-2 font-weight-medium pa-0"
        >
          {{ currentMeta.next_post.title }}
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
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
