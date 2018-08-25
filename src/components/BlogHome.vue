<template>
  <div id="blog-home">
    <h1>{{ page_title }}</h1>
    <!-- Create `v-for` and apply a `key` for Vue. Here we are using a combination of the slug and index. -->

    <v-layout justify-space-around row wrap>
      <v-flex
        v-for="(post, index) in posts"
        :key="post.slug + '_' + index"
        ma-5 xl
      >
        <router-link :to="'/blog/' + post.slug">
          <v-card  class="flat transparent pa-2">
            <v-card-media
              v-if="post.featured_image"
              :src="post.featured_image"
              alt=""
              height="200px"
            >
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="headline">{{ post.title }}</span>
                  </v-flex>
                </v-layout>
              </v-container>

            </v-card-media>

            <v-card-media v-else
              src="http://via.placeholder.com/250x250"
              alt=""
              height="200px"
            >

              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="headline">{{ post.title }}</span>
                  </v-flex>
                </v-layout>
              </v-container>

            </v-card-media>

            <v-card-title primary-title>
              <div>
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
  </div>
</template>

<script>
  import Butter from 'buttercms';

  export default {
    name: 'blog-home',
    data(){
      return {
        butter: Butter('f3f3a8fd2d801ee2d8ccb35a148ec200c7cb888a'),
        page_title: 'Some Stories...',
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
