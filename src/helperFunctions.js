import { useRouter } from 'vue-router'
const router = useRouter()
console.log(router)
export function navigate(item) {
  console.log('router inside', router)
  console.log('item', item)
  if (item.isArchived) {
    window.open(item.path, '_blank') // or _self if you want same tab
  } else {
    router.push(item.path)
  }
}
