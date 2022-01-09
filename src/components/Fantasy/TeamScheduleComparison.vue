<template>
  <v-row>
    <!-- Time Picker -->
    <v-col cols="3">
      <!-- Date Picker -->
      <v-menu
        ref="timeMenu"
        v-model="dateRangeMenu"
        :close-on-content-click="false"
        :return-value="dateRange"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            readonly outlined dense
            v-model="dateRangeText"
            label="Date Range"
            placeholder=" "
            v-bind="attrs"
            v-on="on"
          />
        </template>

        <v-date-picker
          range no-title scrollable
          v-if="dateRangeMenu"
          v-model="dateRange"
          @change="getAllGamesInThis(dateRange)"
        >
        </v-date-picker>
      </v-menu>

    </v-col>

    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="teamRows"
        :options="tableOptions"
        hide-default-footer
      >
        <template #item.id="{ item }">
          <v-btn icon x-large >
            <svg viewBox="0 0 24 16" v-html="determineSVG(item.id)"/>
          </v-btn>
        </template>

<!--        <template #item.games="{ item }">-->
<!--          {{ item.games.length }}-->
<!--        </template>-->



      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { getGamesWithinThis, getTeams } from '@/services/FantasyServices';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)

import {generateArrayOfDates} from '@/services/HelperFunctions';
import Vue from 'vue';

export default {
  name: 'TeamScheduleComparison',
  props: {
    teamLogos: {
      type: Array
    }
  },
  components: {},
  data() {
    return {
      dateRange: [
        dayjs().weekday(1).format('YYYY-MM-DD'),
        dayjs().weekday(7).format('YYYY-MM-DD')
      ],
      dateRangeMenu: false,
      tableOptions: {
        itemsPerPage: 100
      },
      teamRows: [],
      baseHeaders: [
        { text: 'Team', value: 'id' },
        { text: 'Total Games', value: 'games' }
      ]
      //
    };
  },
  created() {
    this.loadTeamRows()
  },
  destroyed() {},
  mounted() {},
  computed: {
    dateRangeText () {
      return this.dateRange.join(' ~ ')
    },
    headers() {
      const dateArray = this.generateDateArray(this.dateRange)

      let headerDates = []
      for (const date of dateArray) {
        headerDates.push({
          text : date,
          value : date
        })
      }

      return [
        ...this.baseHeaders,
        ...headerDates
      ]
    }
    // headers() {
    //   const first = dayjs().weekday(1)
    //   const last = dayjs().weekday(7)
    //   console.log('first/last', first, last)
    //   return today
    // }
    // custHeaders() {
    //   // this.teamHeaders.push(dateArray)
    //
    //   if (this.teamRows.length === 0)
    //     return this.teamHeaders
    //
    //   console.log('teamRows', this.teamRows)
    //
    //   const dateArray = this.generateDateArray(this.dateRange)
    //
    //   const map = new Map(Object.entries(this.teamRows[0]))
    //
    //   return Array.from(map).map(a => {
    //     if (!dateArray.includes(a[0]))
    //       return this.teamHeaders
    //
    //     return {
    //       text: a[0],
    //       value: a[0]
    //     }
    //   });
    // },

  },
  watch: {},
  methods: {
    generateDateArray(dateRange) {
      // TODO redo this garbage.  Needs to take 2 dif dates and calc dates in between not just from today onward...
      const sortedRange = dateRange.sort((a,b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1))
      const diff = dayjs(sortedRange[1]).diff(dayjs(sortedRange[0]), 'day')

      // return generateDatesBetween(diff)
      return generateArrayOfDates(diff)
    },
    determineSVG(team_id) {
      const svgToUse = this.teamLogos.filter(logo => logo.id === team_id)
      return svgToUse[0]?.svg
    },
    getAllGamesInThis(dateRange) {
      // force first date to be before second date
      const sortedRange = dateRange.sort((a,b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1))

      // Before query, apply date range to each team array
      // const diff = dayjs(sortedRange[1]).diff(dayjs(sortedRange[0]), 'day')

      // this.teamRows.dateRange = generateArrayOfDates(diff)

      this.teamRows.map(async (team) => {
        // Retrieve array of dates with games and append to team
        const { data: { dates: dates } } = await getGamesWithinThis(sortedRange, team.id)

        // Need deep reactivity
        // Vue.set(team, 'games', dates)

        // attempt to append date as key with game
        for (const date of dates) {
          Vue.set(team, date.date, date)
        }
      })

      console.log('new teamRows', this.teamRows)
    },
    async loadTeamRows() {
      const { data: { teams } } = await getTeams()
      this.teamRows = teams
    },
  },
};
</script>

<style scoped>

</style>
