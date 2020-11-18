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

        <span>{{ key }}</span>

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
            <div class="my-auto mx-1 grey darken-3 v-divider" style="height: 5px"/>

            <!-- trait value -->
            <v-col cols="auto">
              <span>{{ val }}</span>
            </v-col>

            <!-- boost mod 1 -->
            <v-col cols="auto">
              <span class="caption green--text">
                {{ isBoost1(trait) }}
              </span>
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
        class="pa-2 ma-1 c-border-a-trans "
        :class="{ 'c-border-a-thick': isHighlighted(boost) }"
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
  watch: {
    activeBoosts(newVal, oldVal) {
      // console.log('new', newVal, 'old', oldVal)
      // newVal.forEach((val) => {
      //   console.log('val', val.adjustments)
      // })
    }
  },
  methods: {
    isBoost1(trait) {
      if (this.activeBoosts.length > 0) {
        const t = this.activeBoosts.filter(x => x.adjustments[trait])

        if (t.length === 0)
          return

        return this.isPositive(t[0].adjustments[trait])
      }

      // TODO handle when multiple traits are found within a boost
      // } else if (this.activeBoosts.length === 2){
      //   const t = this.activeBoosts.filter(x => x.adjustments[trait])
      //
      //   if (t.length === 0)
      //     return
      //
      //   console.log('t', t)
      //
      //   return this.isPositive(t[0].adjustments[trait] + t[1].adjustments[trait])
      // }

    },
    isHighlighted(boost){
      return this.activeBoosts.some( e => e.name === boost.name)
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

      // if not, add it which highlights based on isHighlighted()
      this.activeBoosts.push(boost)
    },
    determineBoostType(type) {
      // return all objects that match type: offense
      return this.playerBoosts.filter(boost => boost.type === type)
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
