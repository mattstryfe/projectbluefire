import { useRouter } from 'vue-router'

export function useNavigation() {
  const router = useRouter()

  function navigate(item) {
    if (item.isArchived) {
      window.open(item.path, '_blank')
    } else {
      router.push(item.path)
    }
  }

  return { navigate }
}
