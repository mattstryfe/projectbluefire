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
<!--        <template #item.id="{ item }">-->
<!--          <v-btn icon x-large >-->
<!--            <svg viewBox="0 0 24 16" v-html="determineSVG(item.id)"/>-->
<!--          </v-btn>-->
<!--        </template>-->

<!--        <template #item.games="{ item }">-->
<!--          {{ item.numOfGames }}-->
<!--        </template>-->

        <template #body="{ items }">
          <tr v-for="item in items" :key="item.id">
            <td v-for="header in headers" :key="header.value">

              <span v-if="header.text === 'Games'">
                {{ item[header.value] }}
              </span>

              <v-btn icon x-large v-if="header.text === 'Team'">
                <svg viewBox="0 0 24 16" v-html="determineSVG(item.id)"/>
              </v-btn>

              <!-- Opponent -->
              <span v-if="item[header.value]">
<!--                {{ item[header.value] }}-->
                {{ displayOpponent(item.id, item[header.value]) }}
<!--                <svg viewBox="0 0 24 16" v-html="determineSVG(displayOpponent(item[header.value]))"/>-->
              </span>


            </td>
          </tr>
        </template>
<!--        <template v-for="date in dateRange" #item.${date}="{ item }">-->
<!--          <v-btn icon x-large >-->
<!--            &lt;!&ndash; this is hot garbage for now - but it works &ndash;&gt;-->
<!--            <svg viewBox="0 0 24 16" v-html="determineSVG(displayTeamLogo(item.date))"/>-->
<!--          </v-btn>-->
<!--        </template>-->

<!--        <template #item.2022-01-10="{ item }">-->
<!--          <v-btn icon x-large >-->
<!--            &lt;!&ndash; this is hot garbage for now - but it works &ndash;&gt;-->
<!--            <svg viewBox="0 0 24 16" v-html="determineSVG(displayTeamLogo(item['2022-01-10']))"/>-->
<!--          </v-btn>-->
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
        { text: 'Games', value: 'numOfGames' }
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
    displayOpponent(rowID, item) {
      console.log('display Opponent', item)
      if (typeof item === 'object') {
        // TODO need to return teamID that is NOT the row teamID
        console.log('found an object...', rowID)
      }
      return item
    },
    displayTeamLogo(item) {
      console.log('item', item)
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
    getAllGamesInThis(dateRange) {
      dateRange.sort(firstToLast)

      this.teamRows.map(async (team) => {
        // Retrieve array of dates with games and append to team
        const { data: { dates: dates } } = await getGamesWithinThis(dateRange, team.id)

        // console.log('dates', dates)
        // attempt to append date as key with game
        for (const date of dates) {
          Vue.set(team, date.date, date)
          Vue.set(team, 'numOfGames', dates.length)
        }
      })

      console.log('new teamRows', this.teamRows)
    },
    async loadTeamRows() {
      const { data: { teams } } = await getTeams()
      this.teamRows = teams

      this.getAllGamesInThis(this.dateRange)


    },
  },
};
</script>

<style scoped>

</style>
