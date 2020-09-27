<template>
  <v-card class="col-6 px-1 my-1">
    <h2> Appointment </h2>
    <span> {{ appointmentStatus }}</span>
    <br />
    <v-btn icon @click="claimThisAppointment(appointment)">
      <v-icon  dense >
        {{ appointmentStatus === 'claimed' ? 'fas fa-star' : 'far fa-star' }}
      </v-icon>
    </v-btn>
  </v-card>
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
  created() {},
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
