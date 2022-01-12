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

        <!-- hack to only target those which need edited.  Better than redoing the entire header in #body -->
        <template v-for="header in headers" #[`header.${header.value}`]="{ header }">
          {{ parseHeader(header) }}
        </template>

        <!-- Body -->
        <template #body="{ items }">
          <tr
            :class="{'primary': item.id === selectedId}"
            v-for="item in items"
            :key="item.id"
            @click="activeRow(item.id)"
          >
            <td v-for="header in headers" :key="header.value">

              <!-- Team -->
              <v-btn icon x-large
                v-if="header.text === 'Team'"
              >
                <svg viewBox="0 0 24 16" v-html="determineSVG(item.id)"/>
              </v-btn>

              <!-- Number of Games -->
              <span v-if="header.text === '# of Games'">
                {{ item[header.value] }}
              </span>

              <!-- Opponent -->
              <v-btn icon x-large
                v-if="typeof item[header.value] === 'object'"
              >
                <svg viewBox="0 0 24 16" v-html="determineSVG(getOpponentId(item.id, item[header.value]))"/>
              </v-btn>


            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { getGamesWithinThis, getTeams } from '@/services/FantasyServices';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)

import { firstToLast, generateArrayOfDates } from '@/services/HelperFunctions';
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
      selectedId: null,
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
        { text: '# of Games', value: 'numOfGames' }
      ]
      //
    };
  },
  created() {
  },
  destroyed() {},
  mounted() {
    this.loadTeamRows()
  },
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
  },
  watch: {},
  methods: {
    activeRow(id) {
      console.log('id', id)
      this.selectedId = id
    },
    getOpponentId(rowID, item) {
      const opponent = item.games[0].teams.away.team.id === rowID
        ? item.games[0].teams.home
        : item.games[0].teams.away
      return opponent.team.id
    },
    displayTeamLogo(item) {
      if (!item)
        return ''
      return item.games[0].teams.away.team.id
    },
    generateDateArray(dateRange) {
      dateRange.sort(firstToLast)
      const diff = dayjs(dateRange[1]).diff(dayjs(dateRange[0]), 'day')

      return generateArrayOfDates(diff, dateRange[0])
    },
    determineSVG(team_id) {
      const svgToUse = this.teamLogos.filter(logo => logo.id === team_id)
      return svgToUse[0]?.svg
    },
    async getAllGamesInThis(dateRange) {
      dateRange.sort(firstToLast)

      const { data: { teams } } = await getTeams()

      for (const el of teams) {
        const { data: { dates: dates } } = await getGamesWithinThis(dateRange, el.id)

        for (const date of dates) {
          Vue.set(el, date.date, date)
          Vue.set(el, 'numOfGames', dates.length)
        }
      }

      console.log('teams', teams)
      return teams
      // this.teamRows.map(async (team) => {
      //   // Retrieve array of dates with games and append to team
      //   const { data: { dates: dates } } = await getGamesWithinThis(dateRange, team.id)
      //
      //   // console.log('dates', dates)
      //   // attempt to append date as key with game
      //   for (const date of dates) {
      //     Vue.set(team, date.date, date)
      //     Vue.set(team, 'numOfGames', dates.length)
      //   }
      // })

      // console.log('new teamRows', this.teamRows)
    },
    async loadTeamRows() {
      // const { data: { teams } } = await getTeams()
      // this.teamRows = teams

      this.teamRows = await this.getAllGamesInThis(this.dateRange)
    },
    parseHeader(header) {
      // if (dayjs(header.value).isValid()) {
      //   return dayjs(header.value).format('ddd')
      // }
      return dayjs(header.value).isValid() ? dayjs(header.value).format('ddd') : header.text
    }
  },
};
</script>

<style scoped>

>>>tr:hover {
  background-color: #303030 !important;
  border-color: #303030 !important;
}
</style>
