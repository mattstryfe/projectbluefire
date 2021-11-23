<template>
  <v-card outlined>
    <v-list-item three-line>
      <v-list-item-content>
        #{{ player.jerseyNumber }}

        <span class="overline text-wrap">
          {{ player.person.fullName}}
        </span>
      </v-list-item-content>

      <v-list-item-avatar tile color="grey" size="80">
        <v-img :src="loadHeadshot(player.person.id)"/>

      </v-list-item-avatar>
    </v-list-item>
<!--    <v-avatar>-->
<!--      <v-img :src="loadHeadshot(player.person.id)"/>-->
<!--    </v-avatar>-->

<!--    <v-card-title>-->
<!--      {{ player.person.fullName }}-->
<!--    </v-card-title>-->

  </v-card>
</template>

<script>
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
  computed: {},
  watch: {},
  methods: {
    loadHeadshot(player_id){
      // console.log('headshot', `${this.headshotURL}${player_id}.jpg`)
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
