<template>
  <v-row no-gutters class="justify-space-around">
    <v-card
      v-for="(boost, i) in playerBoosts"
      :key="i"
      class="pa-2 ma-1"
      :class="isHighlighted(boost)"
      @click="selectBoost(boost)"
      width="125"
    >
      <!-- new boost icon -->
      <v-row class="align-content-center justify-center">
        <v-icon
          size="50"
          :color="determineIconColor(boost.type)"
          class="pa-1"
        >
          {{ boost.icon }}
        </v-icon>
      </v-row>

      <v-divider/>

      <!-- boost name -->
      <v-sheet class="transparent">
        <span class="caption text-center text-uppercase text-truncate d-block mt-1">
          {{ boost.name }}
        </span>
      </v-sheet>

    </v-card>
  </v-row>
</template>

<script>
import { playerBoosts } from '@/templates/nhl21/playerBoosts'

export default {
  name: 'PlayerBoosts',
  props: {},
  components: {},
  data() {
    return {
      playerBoosts,
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    activeBoosts: {
      get() {
        return this.$store.state.activeBoosts
      },
      set(newVal) {
        this.$store.commit("updateActiveBoosts", newVal);
      }
    }
  },
  watch: {},
  methods: {
    selectBoost(boost) {
      // find boost
      const ind = this.activeBoosts.indexOf(boost)

      // if it exists, remove it
      if (ind !== -1) {
        this.activeBoosts.splice(ind, 1)
        return
      }

      // if 2 are already selected, remove the first one which was selected
      if (this.activeBoosts.length === 2)
        this.activeBoosts.shift()

      // Always push newly selected boost
      this.activeBoosts.push(boost)
    },
    isHighlighted(boost){
      const ind = this.activeBoosts.indexOf(boost)

      if (ind === 0)
        return 'c-border-a-orange'
      if (ind === 1)
        return 'c-border-a-blue'
      // default return value.  otherwise, class will not properly overwrite
      return 'c-border-a-grey c-border-a-trans '
    },
    determineIcon(type) {
      const icons = {
        offense: 'fa-bullseye',
        defense: 'fa-shield-alt',
        athleticism: 'fa-running'
      }

      return icons[type]
    },
    determineIconColor(type) {
      const colors = {
        offense: 'red',
        defense: 'blue',
        athleticism: 'orange'
      }

      return colors[type]
    },
    isPositive(stat, formatFor) {
      // 'table' denotes special formatting for stat sheet
      if (formatFor === 'table')
        return (stat > 0) ? `(+${stat})` : `(${stat})`

      return (stat > 0) ? `+${stat}` : stat
    },
  }
}
</script>

<style scoped>

</style>
