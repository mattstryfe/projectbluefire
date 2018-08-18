<template>
  <div class="hello">
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
  import Butter from 'buttercms';
  // export const butter =

  export default {
    name: 'Blog Post',
    data(){
      return {
        butter: Butter('f3f3a8fd2d801ee2d8ccb35a148ec200c7cb888a'),
        title: 'Blog Post'
      }
    },
    created(){
      console.log('title', this.butter)
      this.butter.post.list({page: 1, page_size: 10}).then(function(response) {
        console.log(response)
      })
    },
    mounted(){
    },
    methods(){

    }
  }
</script>

<style scoped>

</style>
