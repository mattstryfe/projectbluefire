import { defineStore } from 'pinia'
import Butter from 'buttercms';

const butter = Butter(import.meta.env.VITE_BUTTER_CMS_READ_API_KEY);

export const useButterStore = defineStore('butterStore', {
  state: () => ({
    posts: [],
    recentPosts: [],
    currentPost: null,
    loading: false,
    error: null
  }),

  getters: {
    getPostBySlug: (state) => (slug) => {
      return state.posts.find((post) => post.slug === slug)
    },
    totalPosts: (state) => state.posts.length,
    hasRecentPosts: (state) => state.recentPosts.length > 0
  },
  actions: {
    async fetchPosts(page = 1, pageSize = 10) {
      this.loading = true
      this.error = null

      try {
        const response = await butter.post.list({
          page,
          page_size: pageSize
        })
        this.posts = response.data.data
        return response.data
      } catch (err) {
        this.error = err.message || 'Failed to fetch posts'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchRecentPosts(count = 3) {
      this.loading = true
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
        this.loading = false
      }
    },

    async fetchPost(slug) {
      this.loading = true
      this.error = null

      try {
        const response = await butter.post.retrieve(slug)
        this.currentPost = response.data.data
        return this.currentPost
      } catch (err) {
        this.error = err.message || 'Failed to fetch post'
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
