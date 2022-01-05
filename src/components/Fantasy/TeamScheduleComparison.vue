<template>
  <v-row>
    <!-- Time Picker -->
    <v-col cols="3">
      <!-- Date Picker -->
      <v-menu
        ref="timeMenu"
        v-model="dateRangeMenu"
        :close-on-content-click="false"
        :return-value.sync="dateRange"
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
          @change="getTeamSchedules(dateRange)"
        >
        </v-date-picker>
      </v-menu>

    </v-col>

    <v-col cols="12">
      <v-data-table
        :headers="teamHeaders"
        :items="teamRows"
      >
        <template #item.id="{ item }">
          <v-btn icon x-large >
            <svg viewBox="0 0 24 16" v-html="determineSVG(item.id)"/>
          </v-btn>
        </template>

      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { getTeams, getTeamSchedules } from '@/services/FantasyServices';
import dayjs from 'dayjs';

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
      dateRange: ['2022-01-04', '2022-01-11'],
      dateRangeMenu: false,
      teamRows: [],
      teamHeaders: [
        { text: 'id', value: 'id' },

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
  },
  watch: {},
  methods: {
    determineSVG(team_id) {
      const svgToUse = this.teamLogos.filter(logo => logo.id === team_id)
      return svgToUse[0]?.svg
    },
    async getTeamSchedules(dateRange) {
      const sortedRange = dateRange.sort((a,b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1))

      // Grab dates with games and raw data
      const {
        data: { dates: datesWithGames },
        data
      } = await getTeamSchedules(sortedRange)

      console.log('data', data)
      console.log('datesWithGames', datesWithGames)

      this.datesWithGames = datesWithGames
    },
    async loadTeamRows() {
      const { data: { teams } } = await getTeams()
      this.teamRows = teams
      console.log('teamRows', this.teamRows)
    },
  },
};
</script>

<style scoped>

</style>
