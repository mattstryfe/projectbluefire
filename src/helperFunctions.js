import { useRouter } from 'vue-router'
const router = useRouter()
export function navigate(item) {
  if (item.isArchived) {
    window.open(item.path, '_blank') // or _self if you want same tab
  } else {
    router.push(item.path)
  }
}
