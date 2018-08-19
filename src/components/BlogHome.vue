<template>
  <div id="blog-home">
    <h1>{{ page_title }}</h1>
    <!-- Create `v-for` and apply a `key` for Vue. Here we are using a combination of the slug and index. -->

    <v-layout justify-space-around row wrap>
      <v-flex
        v-for="(post, index) in posts"
        :key="post.slug + '_' + index"
        ma-5 xs3 xs
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
    <!--
    <div
      v-for="(post,index) in posts"
      :key="post.slug + '_' + index"
    >
      <router-link :to="'/blog/' + post.slug">
        <article class="media">
          <figure>
            &lt;!&ndash; Bind results using a `:` &ndash;&gt;
            &lt;!&ndash; Use a `v-if`/`else` if their is a `featured_image` &ndash;&gt;
            <img
              v-if="post.featured_image"
              :src="post.featured_image"
              alt=""
            >
            <img
              v-else
              src="http://via.placeholder.com/250x250"
              alt=""
            >
          </figure>
          <h2>{{ post.title }}</h2>
          <p>{{ post.summary }}</p>
        </article>
      </router-link>
    </div>-->
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
  .post-container {
  h1, h2, h3, h4, h5 {
    font-weight: 600;
    margin-bottom: 1em;
    margin-top: 1.5em;
  }

  ul, ol {
    margin-bottom: 1.25em;

  li {
    margin-bottom: 0.25em;
  }
  }

  p {
    font-family: Georgia, Cambria, "Times New Roman", Times, serif;
    font-size: 1.25em;
    line-height: 1.58;
    margin-bottom: 1.25em;
    font-weight: 400;
    letter-spacing: -.003em;
  }

  /* Responsive default image width */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Responsive floating */
  @media only screen and (min-width: 720px)  {
    .butter-float-left {
      float: left;
      margin: 0px 10px 10px 0px;
    }

    .butter-float-right {
      float: right;
      margin: 0px 0px 10px 10px;
    }
  }

  /* Image caption */
  figcaption {
    font-style: italic;
    text-align: center;
    color: #ccc;
  }

  p code {
    padding: 2px 4px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 4px;
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  }

  pre {
    display: block;
    padding: 1em;
    margin: 0 0 2em;
    font-size: 1em;
    line-height: 1.4;
    word-break: break-all;
    word-wrap: break-word;
    color: #333333;
    background-color: #f5f5f5;
    font-family: Menlo, Monaco,Consolas, "Courier New", monospace;
  }
  }
</style>
