<template>
  <v-container fluid>
    <v-sheet height="100px" class="transparent">
      <!-- small spacer -->
    </v-sheet>

    <v-row class="text-center mb-5">
      <v-col>
        <p class="text-h1">Project <span class="blue--text text--lighten-2">Bluefire</span></p>
        <span class="amber--text text--darken-2">{{ missionStatement }}</span>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-row class="justify-space-around mt-5">
      <v-col cols="12" xl="3" lg="4" md="4" sm="4" xs="12"
        v-for="page in pages"
        :key="page.title"
        class="text-center"
      >
        <v-card flat hover
          color="transparent"
          class="pa-2"
          :to="page.href"
        >
          <!-- Badge is only for Blog! -->
          <v-sheet v-if="page.name === 'blog'" class="transparent">
            <v-badge
              bordered
              offset-x="12"
              offset-y="25"
              color="blue lighten-2"
              icon="new"
              :content="numOfNewPosts"
              overlap
            >
              <v-icon size="8vw" :color="page.color" >
                {{ page.icon}}
              </v-icon>
            </v-badge>
          </v-sheet>

          <!-- everything else -->
          <v-sheet v-else class="transparent">
            <v-icon size="8vw" :color="page.color" >
              {{ page.icon}}
            </v-icon>
          </v-sheet>

          <v-card-text class="title font-weight-bold">
            {{ page.title }}
          </v-card-text>
          <v-card-text class=" pt-0">
            {{ page.desc }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <ActivityPanels> </ActivityPanels>

  </v-container>
</template>

<script>
import ActivityPanels from '../components/GitHub/ActivityPanels'
import { fetchBlogPosts } from '@/services/BasicServices'

export default {
  name: 'home',
  components: {ActivityPanels},
  props: {},
  data () {
    return {
      missionStatement: 'An attempt to improve everything; beginning with weather.',
      numOfNewPosts: 0
    }
  },
  mounted() {},
  created() {
    this.getBlogPosts()
  },
  computed: {
    pages () {
      return this.$store.state.pages
    }
  },
  methods: {
    async getBlogPosts(){
      const posts = await fetchBlogPosts()
      const now = this.dayjs()
      this.numOfNewPosts = posts.filter(post => now.diff(this.dayjs(post.published), 'd') < 10 ).length || '0'
      console.log('numOfNewPosts', this.numOfNewPosts, posts.filter(post => now.diff(this.dayjs(post.published), 'd') < 10 ).length)
    }
  },
  watch: {}
}
</script>

<style scoped>

</style>
