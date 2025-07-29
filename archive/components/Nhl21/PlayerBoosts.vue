<template>
  <v-row no-gutters class="justify-center">
    <v-card
      v-for="(boost, i) in filteredPlayerBoosts"
      :key="i"
      class="pa-2 ma-1 col-3 col-sm"
      :class="isHighlighted(boost)"
      @click="selectBoost(boost)"
    >
      <!-- new boost icon -->
      <v-row class="align-content-center justify-center">
        <v-icon size="50" :color="determineIconColor(boost.type)" class="pa-1">
          {{ boost.icon }}
        </v-icon>
      </v-row>

      <v-divider />

      <!-- boost name -->
      <v-sheet class="transparent">
        <span
          class="caption text-center text-uppercase text-truncate d-block mt-1"
        >
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
      playerBoosts
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    boostFilters() {
      return this.$store.state.boostFilters
    },
    filteredPlayerBoosts() {
      if (this.boostFilters.length === 0) return this.playerBoosts

      const inBoostFilters = (statToFilterBy) =>
        this.boostFilters.includes(statToFilterBy)
      // filter all player boosts, and get keys from adjustments [fgt, chk, acc, etc...]
      // use some() to determine which boosts to display based on filters being applied
      return this.playerBoosts.filter((boost) =>
        Object.keys(boost.adjustments).some(inBoostFilters)
      )
    },
    selectedBoosts: {
      get() {
        return this.$store.state.selectedBoosts
      },
      set(newVal) {
        this.$store.commit('updateSelectedBoosts', newVal)
      }
    }
  },
  watch: {
    filteredPlayerBoosts(newVal) {
      this.selectedBoosts = this.selectedBoosts.filter((x) =>
        newVal.includes(x)
      )
    }
  },
  methods: {
    selectBoost(boost) {
      // find boost
      const selectedBoosts = this.selectedBoosts
      const ind = selectedBoosts.indexOf(boost)

      // if it exists, remove it
      if (ind !== -1) {
        selectedBoosts.splice(ind, 1)
        return
      }

      // if 2 are already selected, remove the first one which was selected
      if (selectedBoosts.length === 2) selectedBoosts.shift()

      // Always push newly selected boost
      selectedBoosts.push(boost)
      this.selectedBoosts = selectedBoosts
    },
    isHighlighted(boost) {
      const ind = this.selectedBoosts.indexOf(boost)

      if (ind === 0) return 'c-border-a-orange'
      if (ind === 1) return 'c-border-a-blue'
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
      if (formatFor === 'table') return stat > 0 ? `(+${stat})` : `(${stat})`

      return stat > 0 ? `+${stat}` : stat
    }
  }
}
</script>

<style scoped></style>
