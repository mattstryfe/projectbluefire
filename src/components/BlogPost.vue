<template>
  <div id="blog-post">
    <h1>{{ post.data.title }}</h1>
    <h4>{{ post.data.author.first_name }} {{ post.data.author.last_name }}</h4>
    <div v-html="post.data.body"></div>

    <router-link
      v-if="post.meta.previous_post"
      :to="/blog/ + post.meta.previous_post.slug"
      class="button"
    >
      {{ post.meta.previous_post.title }}
    </router-link>
    <router-link
      v-if="post.meta.next_post"
      :to="/blog/ + post.meta.next_post.slug"
      class="button"
    >
      {{ post.meta.next_post.title }}
    </router-link>
  </div>
</template>

<script>
  import Butter from 'buttercms';

  export default {
    name: 'blog-post',
    data() {
      return {
        butter: Butter('f3f3a8fd2d801ee2d8ccb35a148ec200c7cb888a'),
        page_title: 'Blog Home',
        post: {}
      }
    },
    methods: {
      getPost() {
        this.butter.post.retrieve(this.$route.params.slug)
          .then(res => {
            this.post = res.data
            console.log('this.post', this.post)
          }).catch(res => {
          console.log(res)
        })
      }
    },
    watch: {
      $route(to, from) {
        this.getPost()
      }
    },
    created() {
      this.getPost()
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
