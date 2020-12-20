<template>
  <v-container fluid>
    <v-row>
      <!-- drop downs -->
      <v-col class="col-3">
        <v-select
          dense solo-inverted outlined
          label="Type"
          :items="listOfPlayerTypes"
          v-model="playerType"
        />
      </v-col>

      <v-spacer/>
    </v-row>

    <!-- Stats AREA -->
    <v-row
      class="justify-space-around px-2"
    >
      <v-sheet
        class="col mx-2 mb-5 pa-3 c-border-a-grey"
        v-for="(cat, key) in playerTypes[playerType]"
        :key="cat.name"
      >
        <!-- boost icon -->
        <v-icon
          size="25"
          left
          :color="determineIconColor(key)"
          class="ma-2"
        >
          {{ determineIcon(key)}}
        </v-icon>

        <!-- Category Header -->
        <span class="text-h5 text-capitalize">{{ key }}</span>

        <v-divider/>

        <!-- Stat Sheet -->
        <v-sheet
          v-for="(val, stat) in cat"
          :key="stat"
        >
          <v-row no-gutters>

            <!-- stat name -->
            <!--  class="text-truncate d-block" -->
            <v-col cols="auto">
              <span
                @click="updateBoostFilter(stat)"
                class="cust-pointer"
                :class="highlightIfSelected(stat)"
              >
                {{ decodeStat(stat) }}
              </span>
            </v-col>

            <!-- line spacer -->
            <div class="my-auto mx-1 grey darken-3 spacer" style="height: 2px"/>

            <!-- Boosts -->
            <v-col
              cols="auto"
            >
              <span
                class="caption"
                v-for="(boost, ind) in selectedBoosts"
                :key="boost.name"
                :class="ind === 0 ? 'orange--text' : 'blue--text'"
              >
                {{ displaySelectedBoostMods(stat, boost) }}
              </span>
            </v-col>

            <!-- stat value -->
            <v-col cols="auto">
              <span
                class="ml-1"
                :class="determineStatColor(stat, cat)"
              >
                {{ addBoostToBaseStat(stat, cat) }}
              </span>
            </v-col>

          </v-row>

        </v-sheet>
      </v-sheet>
    </v-row>

    <!-- Boost filter area -->
    <PlayerBoostFilters></PlayerBoostFilters>

    <!-- Boosts -->
    <PlayerBoosts></PlayerBoosts>

  </v-container>
</template>

<script>
import { playerTypes, traitKey } from '@/templates/nhl21/offense'
import { playerBoosts } from '@/templates/nhl21/playerBoosts'
import PlayerBoosts from '@/components/Nhl21/PlayerBoosts'
import PlayerBoostFilters from '@/components/Nhl21/PlayerBoostFilters'

export default {
  name: "nhl21",
  props: {},
  components: { PlayerBoostFilters, PlayerBoosts },
  data () {
    return {
      playerType: 'sniper',
      playerTypes,
      playerBoosts,
      traitKey,
    }
  },
  created () { },
  destroyed () {},
  mounted () {},
  computed: {
    selectedBoosts() {
      return this.$store.state.selectedBoosts
    },
    listOfPlayerTypes() {
      return ['sniper', 'playmaker']
    },
    boostFilters: {
      get() {
        return this.$store.state.boostFilters
      },
      set(val) {
        this.$store.commit('updateBoostFilters', val)
      }
    }
  },
  watch: {},
  methods: {
    highlightIfSelected() {
      return ''
    },
    updateBoostFilter(stat) {
      // look for stat in boostFilters
      const ind = this.boostFilters.indexOf(stat)

      // if it exists, remove it
      if (ind !== -1)
        this.boostFilters.splice(ind, 1)
      // if not, add it.  Binds to commit setter in computed & updates state
      else
        this.boostFilters.push(stat)
    },
    determineStatColor(stat, cat) {
      const statAndVal = this.selectedBoosts.filter(x => x.adjustments[stat])

      if (statAndVal.length === 0)
        return

      if (parseInt(cat[stat]) > parseInt(cat[stat]) + parseInt(statAndVal[0].adjustments[stat]))
        return 'red--text'
      else
        return 'green--text'
    },
    addBoostToBaseStat(stat, cat) {
      const statAndVal = this.selectedBoosts.filter(x => x.adjustments[stat])

      // if none were found return the base stat
      if (statAndVal.length === 0)
        return cat[stat]

      // if boosts were found, add stat + adjustment val
      return statAndVal.length === 1 ?
        parseInt(cat[stat]) + statAndVal[0].adjustments[stat] :
        parseInt(cat[stat]) + statAndVal[0].adjustments[stat] + statAndVal[1].adjustments[stat]
    },
    displaySelectedBoostMods(stat, boost) {
      const t = boost.adjustments[stat]
      if (t === undefined)
        return

      return this.isPositive(t, 'table')
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
    decodeStat(val) {
      const { [val]: stat } = traitKey
      return stat
    }
  }
}
</script>

<style scoped>
.cust-pointer {
  cursor: pointer;
}
</style>
