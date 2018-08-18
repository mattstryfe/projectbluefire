<template>
  <div class="hello">
    <h1>{{ page_title }}</h1>
  </div>
</template>

<script>
  import Butter from 'buttercms';
  // import { butter } from '@/buttercms'

  export default {
    name: 'Blog',
    data(){
      return {
        butter: Butter('f3f3a8fd2d801ee2d8ccb35a148ec200c7cb888a'),
        page_title: 'Blog Home',
        posts: []
      }
    },
    methods: {
      getPosts() {
        this.butter.post.list({
          page: 1,
          page_size: 10
        }).then(res => {
          this.posts = res.data.data
          console.log('this.posts', this.posts)
        })
      }
    },
    created() {
      this.getPosts()
    }
  }
</script>

<style scoped>

</style>
