<template>
  <v-sheet>
    <h4 class="my-2"> Appointments </h4>
    <v-btn @click="getAppointments">
      Get Appointments
    </v-btn>

    <!-- Cards -->
    <v-row>
      <MercCard
        v-for="appointment in appointments"
        :key="appointment.date_time"
        :appointment="appointment.appointment"
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
      appointments: null
      //
    }
  },
  created () {},
  destroyed () {},
  mounted () {},
  computed: {},
  watch: {},
  methods: {
    async getAppointments() {
      this.appointments = await getAppointmentsFromDb()
      console.log('appoointments', this.appointments)
    }
  }
}
</script>

<style scoped>
</style>
