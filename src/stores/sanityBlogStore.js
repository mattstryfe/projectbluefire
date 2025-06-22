import { defineStore } from 'pinia'

export const useSanityBlogStore = defineStore('sanityBlogStore', {
  state: () => ({
    posts: [],
    recentPosts: [],
    currentPost: {},
    currentMeta: {},
    isLoading: false,
    error: null,
    breadCrumbs: ['blog']
  }),

  getters: {
    getPostBySlug: (state) => (slug) => {
      return state.posts.find((post) => post.slug === slug)
    },
    totalPosts: (state) => state.posts.length,
    hasRecentPosts: (state) => state.recentPosts.length > 0
  },
  actions: {
    async fetchPosts(page = 1, pageSize = 20) {
      this.isLoading = true
      this.error = null

      try {
        const response = await butter.post.list({
          page,
          page_size: pageSize
        })
        this.posts = response.data.data
      } catch (err) {
        this.error = err.message || 'Failed to fetch posts'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchRecentPosts(count = 3) {
      this.isLoading = true
      this.error = null

      try {
        const response = await butter.post.list({
          page: 1,
          page_size: count
        })
        this.recentPosts = response.data.data
        return this.recentPosts
      } catch (err) {
        this.error = err.message || 'Failed to fetch recent posts'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchPost(slug) {
      this.isLoading = true
      this.error = null

      try {
        const {
          data: { data: post, meta }
        } = await butter.post.retrieve(slug)
        this.currentPost = post
        this.currentMeta = meta
      } catch (err) {
        this.error = err.message || 'Failed to fetch post'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
