<template>

  <v-fab-transition>
    <v-card class="col-6 px-1 my-1">
      <v-img
        src="@/assets/images/card-placeholder.jpg" />


      <v-card-title> {{ appointment.appointment_location.name }} {{ appointment.appointment_location.locality }}, {{ appointment.appointment_location.administrative_area_level_1 }} {{ appointment.appointment_location.postal_code}} </v-card-title>

      <v-card-text>
        Date: {{ dayjs(appointment.date_time).format ('MMM DD, YYYY') }} <br>
        Time: {{ dayjs(appointment.date_time).format ('h:mm A') }}
      </v-card-text>

      <v-btn icon @click="claimThisAppointment(appointment)">
        <v-icon  dense >
          {{ appointmentStatus === 'claimed' ? 'fas fa-star' : 'far fa-star' }}
        </v-icon>
      </v-btn>
    </v-card>
  </v-fab-transition>

</template>

<script>
import { updateAppointment } from '@/services/MercServices'

export default {
  name: 'MercCard',
  props: {
    appointment: Object
  },
  components: {},
  data() {
    return {
      //
    }
  },
  created() {
    console.log('this.appointment', this.appointment)
  },
  destroyed() {},
  mounted() {},
  computed: {
    appointmentStatus() {
      return this.appointment.appointment.status
    },
    authenticatedUser() {
      return this.$store.state.authenticatedUser
    },
    isUserAuthenticated() {
      return this.$store.state.isUserAuthenticated
    }
  },
  watch: {},
  methods: {
    async claimThisAppointment(appointment) {

      // only temporary until CLAIMED tab is ready
      const action = this.appointmentStatus === 'claimed' ? 'unclaimed' : 'claimed'

      appointment.status = action
      appointment.claimedBy = this.authenticatedUser

      await updateAppointment(appointment)

      // Refresh appointments tab
      this.$store.commit('refreshAppointments')

      // Refresh claimed tab
      this.$store.commit('refreshClaimedAppointments')
    }
  }
}
</script>

<style scoped>

</style>
