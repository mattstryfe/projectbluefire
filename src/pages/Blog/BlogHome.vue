<template>
  <div id="blog-home">
    <h1>{{ page_title }}</h1>
    <v-container grid-list-md fluid fill-height>
      <v-layout row justify-space-around wrap>
        <v-flex
          class="xs12 md6 lg4 xl3"
          :class="{'xl12 lg12 md12 xs12': index === 0 }"
          v-for="(post, index) in posts"
          :key="post.slug + '_' + index"
        >
          <router-link :to="'/blog/' + post.slug">
            <v-card class="flat transparent ma-2">
              <v-card-media
                v-if="post.featured_image"
                :src="post.featured_image"
                alt=""
                height="200px"
              >
              </v-card-media>

              <v-card-media v-else
                src="http://via.placeholder.com/250x250"
                alt=""
                height="200px"
              >
              </v-card-media>

              <span class="font-italic">
                {{ moment(post.published).format("MMM Do YY") }} |
              </span>
              <span>
                {{ post.author.first_name }}
              </span>

              <v-card-title primary-title>
                <div>
                  <p class="headline text-xs-left">{{ post.title }}</p>
                  <span class="grey--text">{{ post.summary }}</span>
                </div>
              </v-card-title>




              <v-card-actions>
                <v-btn flat color="orange">Share</v-btn>
                <v-btn flat color="orange">Explore</v-btn>
              </v-card-actions>
            </v-card>
          </router-link>

        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Butter from 'buttercms'

export default {
  name: 'blog-home',
  data () {
    return {
      butter: Butter('f3f3a8fd2d801ee2d8ccb35a148ec200c7cb888a'),
      page_title: 'Some Stories...',
      posts: []
    }
  },
  methods: {
    getPosts () {
      this.butter.post.list({
        page: 1,
        page_size: 10
      }).then(res => {
        this.posts = res.data.data
        console.log('this.posts', this.posts)
      })
    }
  },
  created () {
    this.getPosts()
  }
}
</script>

<style scoped>

</style>
