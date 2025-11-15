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

  // Actions
  async function fetchPosts(page = 1, pageSize = 20) {
    isLoading.value = true
    error.value = null

    try {
      const response = await butter.post.list({
        page,
        page_size: pageSize
      })
      posts.value = response.data.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch posts'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchRecentPosts(count = 3) {
    isLoading.value = true
    error.value = null

    try {
      const response = await butter.post.list({
        page: 1,
        page_size: count
      })
      recentPosts.value = response.data.data
      return recentPosts.value
    } catch (err) {
      error.value = err.message || 'Failed to fetch recent posts'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPost(slug) {
    console.log('slug', slug)
    isLoading.value = true
    error.value = null

    try {
      const {
        data: { data: post, meta }
      } = await butter.post.retrieve(slug)
      currentPost.value = post
      currentMeta.value = meta
    } catch (err) {
      error.value = err.message || 'Failed to fetch post'
      throw err
    } finally {
      isLoading.value = false
    }
  }

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
    hasRecentPosts,

    // Actions
    fetchPosts,
    fetchRecentPosts,
    fetchPost
  }
})
