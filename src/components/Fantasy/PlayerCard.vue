<template>
  <v-card>
    <v-img :src="loadHeadshot(player.person.id)" width="80"/>

    <v-card-title>
      {{ player.person.fullName }}
    </v-card-title>

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
      return `${this.headshotURL}${player_id}.jpg`
    },
  }
}
</script>

<style scoped>

</style>
