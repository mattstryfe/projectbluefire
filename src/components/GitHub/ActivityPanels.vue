<template>
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
</template>

<script>
import { getGithubPRs } from '../../services/BasicServices'

export default {
  name: 'ActivityPanels',
  props: {},
  components: {},
  data() {
    return {
      panels: [],
      pullRequests: null
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
  }
}
</script>

<style scoped>

</style>
