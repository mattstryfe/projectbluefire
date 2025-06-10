import { ref } from 'vue'
import { useSanityClient } from '@/plugins/sanity'

export function useSanity(query, params = {}) {
  const client = useSanityClient()
  const data = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      data.value = await client.fetch(query, params)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // fetchData()

  return {
    data,
    loading,
    error,
    fetchData
  }
}
