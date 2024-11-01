import { storeToRefs } from 'pinia';
import { useButterStore } from '@/stores/butterStore';

export function useButter() {
  const store = useButterStore();

  // Use storeToRefs for reactive state
  const { posts, recentPosts, currentPost, loading, error } = storeToRefs(store);

  // Actions don't need to be reactive, so we destructure them directly
  const { fetchPosts, fetchRecentPosts, fetchPost } = store;

  return {
    // Reactive state
    posts,
    recentPosts,
    currentPost,
    loading,
    error,

    // Actions
    fetchPosts,
    fetchRecentPosts,
    fetchPost,

    // Getters
    getPostBySlug: store.getPostBySlug,
    totalPosts: store.totalPosts,
    hasRecentPosts: store.hasRecentPosts
  };
}
