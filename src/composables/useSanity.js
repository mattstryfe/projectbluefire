import { ref } from 'vue'
import { useSanityClient } from '@/plugins/sanity'

export function useSanity(query, params = {}, autoFetch = false) {
  const client = useSanityClient()
  const data = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  const fetchData = async () => {
    isLoading.value = true
    error.value = null
    try {
      data.value = await client.fetch(query, params)
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  if (autoFetch) fetchData().then((r) => (data.value = r.data))

  return {
    data,
    isLoading,
    error,
    fetchData
  }
}
