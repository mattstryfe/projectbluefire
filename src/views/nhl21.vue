<template>
  <v-container fluid>
    <v-row>

      <!-- drop downs -->
      <v-sheet class="pa-1">
        <v-col class="col-6">
          <v-select
            dense solo-inverted outlined
            label="Type"
            :items="listOfPlayerTypes"
            v-model="playerType"
          />
        </v-col>

        <v-spacer/>
      </v-sheet>
    </v-row>

    <!-- stats -->
    <v-row>
      <v-sheet
        class="col col-3 pa-1 ma-1 "
        v-for="(cat, key) in playerTypes[playerType]"
        :key="cat.name"
      >
        <h1>{{ key }}</h1>

        <v-divider/>

        <v-sheet
          v-for="(val, trait) in cat"
          :key="trait"
        >

          <v-row no-gutters>

            <!-- trait name -->
            <v-col cols="auto">
              <span>{{ decodeTrait(trait) }} </span>
            </v-col>

            <!-- line spacer -->
            <div class="my-auto mx-1 grey darken-3 v-divider" style="height: 5px">

            </div>

            <!-- trait value -->
            <v-col cols="auto">
              <span>{{ val }}</span>
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
        class="pa-2 ma-1 c-border-a "
        :class="{ 'red': isHighlighted(boost) }"
        @click="selectBoost(boost)"
      >
        <!-- boost icon -->
        <v-icon
          size="15"
          left
          color="red"
        >
          {{ determineBoostIcon(boost.name)}}
        </v-icon>

        <!-- boost name -->
        <span>
          {{ boost.name }}
        </span>

        <v-divider/>

        <!-- boost adjustments -->
        <span
          v-for="(trait, adjustment) in boost.adjustments"
          :key="trait"
          class="c-grey-text"
        >
         {{ isPositive(trait) }} {{ adjustment }}
        </span>

      </v-card>


    </v-row>
  </v-container>
</template>

<script>
import {playerTypes, playerBoosts, traitKey} from '@/templates/nhl21/offense'

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
    isHighlighted(boost){
      return this.activeBoosts.some( e => e.name === boost.name)
    },
    selectBoost(boost) {
      // if 2 are already selected, remove the first one which was selected
      if (this.activeBoosts.length === 2)
        this.activeBoosts.shift()


      // find boost
      const ind = this.activeBoosts.indexOf(boost)

      // if it exists, remove it
      if (ind !== -1) {
        this.activeBoosts.splice(ind, 1)
        return
      }

      // if not, add it which highlights based on isHighlighted()
      this.activeBoosts.push(boost)
    },
    determineBoostType(type) {
      // return all objects that match type: offense
      return this.playerBoosts.filter(boost => boost.type === type)
    },
    determineBoostIcon(type) {
      return 'fa-bullseye'
    },
    isPositive(trait) {
      return (trait > 0) ? `+${trait}` : trait
    },
    decodeTrait(val) {
      const { [val]: trait } = traitKey
      return trait
    }
  }
}
</script>

<style scoped>

</style>
