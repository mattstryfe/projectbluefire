<template>
  <v-row class="c-large-top-margin">
    <h2 class="ma-2 pa-2 amber--text text--darken-2"> Code Base Activity</h2>

      <v-expansion-panels popout v-model="panels">
      <v-expansion-panel
        v-for="(pull, i) in pullRequests"
        :key="i"
        class=""
        @change="isPanelExpanded(pull.number)"
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
              <span class="pa-0 ma-0 subtitle-2 c-grey-text ">Contributor:</span>
              <p class="pa-0 ma-0 caption text-uppercase amber--text text--darken-2"> {{ pull.user.login }}</p>
              <p class="pa-0 ma-0 caption blue--text text--lighten-2"> {{ daysAgo(pull.merged_at)  }} </p>
            </v-sheet>

            <v-sheet class="col col-sm-9 ml-2">
              <p class="ma-0 pa-0 subtitle-2 c-grey-text">
                <v-icon size="20" class="mr-1 blue--text text--lighten-2">
                  fa-code-branch
                </v-icon>
                <span class="caption">({{ pull.number }})</span>  {{ pull.title }}
              </p>
            </v-sheet>
          </v-row>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-row v-for="(message, i) in commitMessages" :key="i" class="px-5 py-0 ma-0 align-center">
            <v-avatar size="25">
              <v-img
                v-if="message.author.avatar_url"
                :src="message.author.avatar_url"
              />
              <v-icon v-else>i</v-icon>
            </v-avatar>

            <v-sheet class="col col-sm-9">
              <p class="ma-0 pa-0 subtitle-2 c-grey-text sen">
                <v-icon size="10" class="blue--text text--lighten-2">
                  fa-code-branch
                </v-icon>
                <!--<span class="caption">
                  ({{ daysAgo(message.commit.committer.date) }})
                </span>-->
                {{ message.commit.message }}
              </p>
            </v-sheet>
          </v-row>

        </v-expansion-panel-content>

      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>

<script>
import { fetchGithub } from '../../services/BasicServices'

export default {
  name: 'ActivityPanels',
  props: {},
  components: {},
  data() {
    return {
      panels: [],
      pullRequests: null,
      commitMessages: null
    }
  },
  created() {
    this.getPulls()
  },
  destroyed() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    async isPanelExpanded(number) {
      const { data : commitMessages } = await fetchGithub('commits', number)
      // Commit messages are oldest to newest for some stupid reason...
      this.commitMessages = commitMessages.reverse()
    },
    async getPulls() {
      const { data: pullRequests } = await fetchGithub('PRs')
      this.pullRequests = pullRequests
    },
    daysAgo(merged_at) {
      let now = this.dayjs()
      let then = this.dayjs(merged_at)

      return then.from(now)
    }
  }
}
</script>

<style scoped>

</style>
