<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card v-if="post.data" class="flat transparent pa-3 text-xs-left">
          <h1>{{ post.data.title }}</h1>
          <h4>{{ post.data.author.first_name }} {{ post.data.author.last_name }}</h4>
          <div v-html="post.data.body"></div>

          <router-link
            v-if="post.meta.previous_post"
            :to="/blog/ + post.meta.previous_post.slug"
            class="button mr-2"
          >
            {{ post.meta.previous_post.title }}
          </router-link>

          <span> | </span>

          <router-link
            v-if="post.meta.next_post"
            :to="/blog/ + post.meta.next_post.slug"
            class="button ml-2"
          >
            {{ post.meta.next_post.title }}
          </router-link>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Butter from 'buttercms'

export default {
  name: 'blog-post',
  data () {
    return {
      butter: Butter('f3f3a8fd2d801ee2d8ccb35a148ec200c7cb888a'),
      page_title: 'Blog Post',
      post: {}
    }
  },
  methods: {
    getPost () {
      this.butter.post.retrieve(this.$route.params.slug)
        .then(res => {
          this.post = res.data
          console.log('this.post', res.data)
        }).catch(res => {
          console.log(res)
        })
    }
  },
  watch: {
    $route (to, from) {
      this.getPost()
    }
  },
  created () {
    this.getPost()
  }
}
</script>

<style scoped>

</style>
