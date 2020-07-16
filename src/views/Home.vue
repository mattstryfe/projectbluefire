<template>
  <v-container fluid>
    <v-sheet height="100px">
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
             class="text-center">
        <v-card flat hover
          color="transparent"
          class="pa-2"
          :to="page.href"
        >
          <v-icon size="8vw" :color="page.color" >
            {{ page.icon}}
          </v-icon>
          <v-card-text class="title font-weight-bold">
            {{ page.title }}
          </v-card-text>
          <v-card-text class=" pt-0">
            {{ page.desc }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="c-large-top-margin">
      <h2 class="ma-2 pa-2"> Code Base Activity </h2>

      <v-expansion-panels popout v-model="panels">
        <v-expansion-panel
          v-for="(pull, i) in pullRequests"
          :key="i"
          class=""
          @change="isPanelExpanded()"
          >
            <v-expansion-panel-header>
              <v-row no-gutters>
                <v-avatar>
                  <v-img
                    v-if="pull.user.avatar_url"
                    :src="pull.user.avatar_url"
                  />
                  <v-icon v-else>i</v-icon>
                </v-avatar>

                <v-sheet class="col col-sm-2 col-md-1 ml-2 mb-2 transparent elevation-0">
                  <p class="pa-0 ma-0 subtitle-2 c-grey-text ">Contributor:</p>
                  <p class="pa-0 ma-0 overline amber--text text--darken-2"> {{ pull.user.login }}</p>
                  <p class="pa-0 ma-0 overline blue--text text--lighten-2 "> {{ daysAgo(pull.merged_at)  }} </p>
                </v-sheet>

                <v-sheet class="col col-sm-9">
                  <p class="ma-0 pa-0 subtitle-2 c-grey-text">PR#{{ pull.number }}:  {{ pull.title }}</p>
                  <p> details...</p>
                </v-sheet>
              </v-row>
            </v-expansion-panel-header>
        </v-expansion-panel>
      </v-expansion-panels>

    </v-row>
  </v-container>
</template>

<script>
import { getGithubPRs } from '../services/BasicServices'

export default {
  name: 'home',
  components: {},
  props: {},
  data () {
    return {
      panels: [],
      treeList: {},
      pullRequests: null,
      missionStatement: 'An attempt to improve everything; beginning with weather.',
    }
  },
  mounted() {},
  created() {
    this.getPulls()
  },
  computed: {
    pages () {
      return this.$store.state.pages
    },

  },
  methods: {
    isPanelExpanded() {
      console.log('panels', this.panels)
    },
    async getPulls() {
      const { data: pullRequests } = await getGithubPRs()
      this.pullRequests = pullRequests
      console.log('this.pullRequests', this.pullRequests)
    },
    daysAgo(merged_at) {
      let now = this.dayjs()
      let then = this.dayjs(merged_at)

      return then.from(now)
    }
  },
  watch: { }
}
</script>

<style scoped>
.c-large-top-margin {
  margin-top: 10em;
}
</style>
