<template>
  <v-container fluid>

    <v-row>
      <v-btn @click="yahooAuth('/test')">
        TEST
      </v-btn>
      <v-btn @click="yahooAuth('/auth/yahoo')">
        AUTH
      </v-btn>
      <v-btn @click="legacyYahooAuth('/request_auth')">
        Legacy Way
      </v-btn>

      <v-btn :href="yahooAuthLegacyUrl" target="_blank">
        Ghetto Way
      </v-btn>
    </v-row>
    <v-row>
      <v-btn icon x-large v-for="team in teams" :key="team.id" class="ma-1 pa-1" @click="loadPlayers(team)">
        <svg viewBox="0 0 24 16" v-html="determineSVG(team.id)"/>
      </v-btn>
    </v-row>

    <v-row>
      <v-col cols="12">
        {{ selectedTeam }}
      </v-col>

<!--      <v-col cols="2" v-for="player in roster" :key="player.person.id">-->
<!--        <PlayerCard :player="player"/>-->
<!--      </v-col>-->
    </v-row>

    <!-- offense -->
    <v-row>
      <PlayerCard v-for="player in offense" :key="player.person.id" :player="player"/>
    </v-row>

    <!-- defense -->
    <v-row class="my-1">
      <PlayerCard
        v-for="player in defense"
        :key="player.person.id"
        :player="player"
      />
    </v-row>

    <!-- goalies -->
    <v-row>
      <PlayerCard v-for="player in goalies" :key="player.person.id" :player="player"/>
    </v-row>


  </v-container>
</template>

<script>
import {getAllLogos, getPlayers, getTeams, legacyYahooAuth, yahooAuthentication} from '@/services/FantasyServices';
import PlayerCard from '@/components/Fantasy/PlayerCard'

export default {
  name: 'Fantasy',
  props: {},
  components: { PlayerCard },
  data() {
    return {
      selectedTeam: null,
      teams: null,
      roster: [],
      logoURL: process.env.VUE_APP_FNTY_LOGO_ENDPOINT,
      headshotURL: process.env.VUE_APP_FNTY_HSHT_ENDPOINT,
      logos: [],
      showDialog: false
      //
    }
  },
  created() {},
  destroyed() {},
  mounted() {
    this.loadTeams()
    this.loadLogos()
  },
  computed: {
    yahooAuthLegacyUrl() {
      const params = {
        'client_id': process.env.VUE_APP_YAHOO_CLIENT_KEY,
        'redirect_uri': 'https://projectbluefire.com/fantasy',
        'response_type': 'code'
      }

      const base = 'https://api.login.yahoo.com/oauth2/request_auth?'
      const qs = Object.keys(params).map(key => key + '=' + params[key]).join('&')
      console.log('url', base)
      console.log('qs', qs)
      return base + qs + '&output=embed';
    },
    offense() {
      return this.roster.filter(player => player.position.type === 'Forward')
    },
    defense() {
      return this.roster.filter(player => player.position.type === 'Defenseman')
    },
    goalies() {
      return this.roster.filter(player => player.position.type === 'Goalie')
    },
    testSVG() {
      return this.logos[0]?.svg
    }
  },
  watch: {},
  methods: {
    determineSVG(team_id) {
      const svgToUse = this.logos.filter(logo => logo.id === team_id)
      return svgToUse[0]?.svg
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
      console.log('this.roster', roster)

      // break up roster into
    },
    async yahooAuth(target) {
      const res = await yahooAuthentication(target)
      console.log('res', res)
    },
    async legacyYahooAuth(target) {
      this.showDialog = true
      // const res = await legacyYahooAuth(target)
      // console.log('res', res)
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
