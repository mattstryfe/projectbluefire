<template>
  <v-container fluid>
    <v-row align="center" justify="center">
        <v-img
          :src="post.data && post.data.featured_image"
          lazy-src="https://picsum.photos/id/11/10/6"
          aspect-ratio="1.7778"
          max-height="400"
        ></v-img>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card v-if="post.data" class="flat transparent pa-3 text-xs-left elevation-0">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-3">
                {{ dayjs(post.data.published).format("MMM D YY") }} |
                {{ post.data.author.first_name }}
                {{ post.data.author.last_name }}
              </div>
              <v-list-item-title class="headline mb-1">{{ post.data.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <div class="pa-4" v-html="post.data.body"></div>

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
