<template>
  <v-container fluid>
    <v-row>
      <h1>{{ page_title }}</h1>
    </v-row>
    <v-row>
      <v-col
        sm="6"
        md="6"
        lg="4"
        xl="3"
        v-for="(post, index) in posts"
        :key="post.slug + '_' + index"
      >
        <v-card class="ma-2" :to="'/blog/' + post.slug">
          <v-img
            v-if="post.featured_image"
            :src="post.featured_image"
            height="200px"
          >
          </v-img>

          <v-img
            v-else
            src="http://via.placeholder.com/250x250"
            height="200px"
          >
          </v-img>

          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-3">{{ dayjs(post.published).format("MMM D YY") }} | {{ post.author.first_name }}</div>
              <v-list-item-title class="headline mb-1">{{ post.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-truncate">{{ post.summary }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Butter from 'buttercms'

export default {
  name: 'blog-home',
  data: () => ({
    butter: Butter('f3f3a8fd2d801ee2d8ccb35a148ec200c7cb888a'),
    page_title: '',
    posts: []
  }),
  methods: {
    getPosts () {
      this.butter.post.list({
        page: 1,
        page_size: 10
      }).then(res => {
        this.posts = res.data.data
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
