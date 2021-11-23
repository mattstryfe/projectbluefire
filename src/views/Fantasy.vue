<template>
  <v-container fluid>
    <v-row>
      <v-btn icon x-large v-for="team in teams" :key="team.id" class="ma-1 pa-1" @click="loadPlayers(team)">
        <svg viewBox="0 0 24 16" v-html="determineSVG(team.id)"/>
      </v-btn>
    </v-row>

    <v-row>
      <v-col cols="12">
        {{ selectedTeam }}
      </v-col>
      <v-col cols="2" v-for="player in roster" :key="player.person.id">
        <PlayerCard :player="player"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { addLogoEntryToDb, getAllLogos, getPlayers, getTeams} from '@/services/FantasyServices'
import SvgViewer from '@/components/Fantasy/SvgViewer'
import PlayerCard from '@/components/Fantasy/PlayerCard'

export default {
  name: 'Fantasy',
  props: {},
  components: {PlayerCard},
  data() {
    return {
      selectedTeam: null,
      teams: null,
      roster: null,
      logoURL: process.env.VUE_APP_FNTY_LOGO_ENDPOINT,
      headshotURL: process.env.VUE_APP_FNTY_HSHT_ENDPOINT,
      logos: []
      //
    }
  },
  created() {},
  destroyed() {},
  mounted() {
    this.loadTeams()
    this.loadLogos()
    // this.loadLogo(5)
  },
  computed: {
    testSVG() {
      return this.logos[0]?.svg
    }
  },
  watch: {},
  methods: {
    loadLogoIntoDB(team){
      const svg = `${this.logoURL}/${team.id}_dark.svg`
      console.log('svg', svg)
      // addLogoEntryToDb(team)
    },
    determineSVG(team_id) {

      const svgToUse = this.logos.filter(logo => logo.id === team_id)
      // console.log('All Logos', team_id, svgToUse)
      return svgToUse[0]?.svg
      // return this.logos[0]?.svg
    },
    async loadLogos() {
      this.logos = await getAllLogos()
    },
    loadHeadshot(player_id){
      return `${this.headshotURL}${player_id}.jpg`
    },
    async loadTeams() {
      const { data: { teams } } = await getTeams()
      this.teams = teams
      console.log('teams', this.teams)
    },
    async loadPlayers(team) {
      const { data: { roster } } = await getPlayers(team.id)
      this.roster = roster
      this.selectedTeam = team.name
      // console.log('this.roster', roster)
    }
  }
}
</script>

<style scoped>
/* fix for stupid svgs... */
svg:not([fill]) {
  fill: black;
}
/*.bg{fill:#111}.fg{fill:#fcb514}*/
</style>
