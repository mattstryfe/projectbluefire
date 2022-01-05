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
        :items="schedules"
      >

      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { getTeamSchedules } from '@/services/FantasyServices';
import dayjs from 'dayjs';

export default {
  name: 'TeamScheduleComparison',
  props: {},
  components: {},
  data() {
    return {
      dateRange: ['2022-01-04', '2022-01-11'],
      dateRangeMenu: false,
      schedules: null
      //
    };
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    dateRangeText () {
      return this.dateRange.join(' ~ ')
    },
  },
  watch: {},
  methods: {
    async getTeamSchedules(dateRange) {
      const sortedRange = dateRange.sort((a,b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1))
      const { data: dates} = await getTeamSchedules(sortedRange)
      this.schedules = dates
      console.log('schedules', dates)
    }
  },
};
</script>

<style scoped>

</style>
