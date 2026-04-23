import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSanityBlogStore = defineStore('sanityBlogStore', () => {
  // State
  const posts = ref([])
  const recentPosts = ref([])
  const currentPost = ref({})
  const currentMeta = ref({})
  const isLoading = ref(false)
  const error = ref(null)
  const breadCrumbs = ref(['blog'])

  // Getters
  const getPostBySlug = computed(() => (slug) => {
    return posts.value.find((post) => post.slug === slug)
  })

  const totalPosts = computed(() => posts.value.length)

  const hasRecentPosts = computed(() => recentPosts.value.length > 0)

  return {
    // State
    posts,
    recentPosts,
    currentPost,
    currentMeta,
    isLoading,
    error,
    breadCrumbs,

    // Getters
    getPostBySlug,
    totalPosts,
    hasRecentPosts

    // Actions
  }
})
