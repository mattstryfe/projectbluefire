<template>
  <v-col cols="2">
    <v-card outlined
      :class="determineColor(player)"
    >
      <v-card-actions class="ma-0 pa-0" :disabled="!isUserAuthenticated">
        <v-btn icon small
          :disabled="!isUserAuthenticated"
          @click="addPlayer(player)"
        >
          <v-icon small>
            fa-plus
          </v-icon>
        </v-btn>

        <v-btn icon small
          :disabled="!isUserAuthenticated"
          @click="removePlayer(player)"
        >
          <v-icon small>
            fa-minus
          </v-icon>
        </v-btn>
      </v-card-actions>


      <v-list-item three-line>
        <v-list-item-content>
          #{{ player.jerseyNumber }}

          <span class="overline text-wrap">
          {{ player.person.fullName}}
        </span>
        </v-list-item-content>

        <v-list-item-avatar color="grey" size="80">
          <v-img :src="loadHeadshot(player.person.id)"/>
        </v-list-item-avatar>
      </v-list-item>
    </v-card>
  </v-col>
</template>

<script>
import { addPlayerToTeam, removePlayerFromTeam } from '@/services/FantasyServices'

export default {
  name: 'PlayerCard',
  props: {
    player: {
      type: Object,
      default: null
    }
  },
  components: {},
  data() {
    return {
      headshotURL: process.env.VUE_APP_FNTY_HSHT_ENDPOINT,
    }
  },
  created() {
  },
  destroyed() {
  },
  mounted() {
  },
  computed: {
    isUserAuthenticated() {
      return this.$store.state.isUserAuthenticated
    }
  },
  watch: {},
  methods: {
    addPlayer(player) {
      console.log('player', player.person.id)
      addPlayerToTeam(player, this.$store.state.authenticatedUser)
    },
    removePlayer(player) {
      console.log('player', player.person.id)
      removePlayerFromTeam(player, this.$store.state.authenticatedUser)
    },
    determineColor(player){
      const colors = {
        Forward: 'c-bg-blue',
        Defenseman: 'c-bg-orange',
        Goalie: 'c-bg-green'
      }
      return colors[player.position.type]
    },
    loadHeadshot(player_id){
      return `${this.headshotURL}${player_id}.jpg`
    },
  }
}
</script>

<style scoped>
.overline {
  line-height: 1rem !important;
}
</style>
