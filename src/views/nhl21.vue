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

    <!-- stats -->
    <v-row>
      <v-sheet
        class="col col-3 pa-1 ma-1 "
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
        <span>{{ key }}</span>

        <v-divider/>

        <!-- Stat Sheet -->
        <v-sheet
          v-for="(val, stat) in cat"
          :key="stat"
        >
          <v-row no-gutters>

            <!-- stat name -->
            <v-col cols="auto">
              <span>{{ decodeStat(stat) }} </span>
            </v-col>

            <!-- line spacer -->
            <div class="my-auto mx-1 grey darken-3 v-divider" style="height: 5px"/>

            <!-- Boosts -->
            <v-col
              cols="auto"
              v-for="(boost, ind) in activeBoosts"
              :key="boost.name"
            >
              <span
                class="mr-1 caption"
                v-if="boost"
                :class="ind === 0 ? 'green--text' : 'blue--text'"
              >
                {{ displaySelectedBoostMods(stat, boost) }}
              </span>
            </v-col>

            <!-- stat value -->
            <v-col cols="auto">
              <span>{{ addBoostToBaseStat(stat, cat) }}</span>
            </v-col>

          </v-row>

        </v-sheet>
      </v-sheet>
    </v-row>

    <!-- Boosts -->
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

  </v-container>
</template>

<script>
import { playerTypes, playerBoosts, traitKey } from '@/templates/nhl21/offense'

export default {
  name: "nhl21",
  props: {},
  components: {},
  data () {
    return {
      playerType: 'sniper',
      playerTypes,
      playerBoosts,
      traitKey,
      activeBoosts: []
    }
  },
  created () { },
  destroyed () {},
  mounted () {},
  computed: {
    listOfPlayerTypes() {
      return ['sniper', 'playmaker']
    }
  },
  watch: {},
  methods: {
    addBoostToBaseStat(stat, cat) {
      const t = this.activeBoosts.filter(x => x.adjustments[stat])

      if (t.length === 0)
        return cat[stat]

      return t.length === 1 ?
        parseInt(cat[stat]) + t[0].adjustments[stat] :
        parseInt(cat[stat]) + t[0].adjustments[stat] + t[1].adjustments[stat]
    },
    displaySelectedBoostMods(stat, boost) {
      const t = boost.adjustments[stat]
      if (t === undefined)
        return

      return this.isPositive(t, 'table')
    },
    isHighlighted(boost){
      const ind = this.activeBoosts.indexOf(boost)

      if (ind === 0)
        return 'c-border-a-green'
      if (ind === 1)
        return 'c-border-a-blue'

    },
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

</style>
