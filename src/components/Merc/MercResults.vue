<template>
  <v-sheet>
    <h4 class="my-2"> Appointments </h4>
    <v-btn @click="getAppointments">
      Get Appointments
    </v-btn>

    <!-- Cards -->
    <v-row no-gutters class="px-1">
      <MercCard
        v-for="appointment in appointments"
        :key="appointment.date_time"
        :appointment="appointment"
      />
    </v-row>


  </v-sheet>
</template>

<script>
import { getAppointmentsFromDb } from '@/services/MercServices'
import MercCard from '@/components/Merc/MercCard'

export default {
  name: "MercResults",
  props: {},
  components: {MercCard},
  data () {
    return {
      //
    }
  },
  created () {},
  destroyed () {},
  mounted () {},
  computed: {
    appointments() {
      return this.$store.state.appointments
    }
  },
  watch: {},
  methods: {
    async getAppointments() {
      this.$store.commit('updateAppointments')
      console.log('all appointments', this.appointments)
    }
  }
}
</script>

<style scoped>
</style>
