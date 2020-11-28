<template>
  <v-row>
    <v-card
      v-for="(boost, i) in playerBoosts"
      :key="i"
      class="pa-2 ma-1 c-border-a-trans"
      :class="isHighlighted(boost)"
      @click="selectBoost(boost)"
    >
      <!-- boost icon -->
      <v-icon
        size="15"
        left
        :color="determineIconColor(boost.type)"
        class="ma-1"
      >
        {{ determineIcon(boost.type)}}
      </v-icon>

      <!-- boost name -->
      <span>
        {{ boost.name }}
      </span>

      <v-divider/>

      <!-- boost adjustments -->
      <span
        v-for="(trait, adjustment) in boost.adjustments"
        :key="adjustment"
        class="c-grey-text"
      >
         {{ isPositive(trait) }} {{ adjustment }}
      </span>

    </v-card>
  </v-row>
</template>

<script>
import { playerBoosts } from '@/templates/nhl21/playerBoosts'

export default {
  name: 'PlayerBoost',
  props: {},
  components: {},
  data() {
    return {
      playerBoosts,
      // activeBoosts: []
      //
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
