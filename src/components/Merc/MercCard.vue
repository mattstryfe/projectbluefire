<template>

  <v-fab-transition>
    <v-card class="col-6 px-1 my-1">

      <v-img contain
        src="@/assets/images/card-placeholder.jpg">
        <v-chip
          text-color="white"
          color="rgba(197,17,98,.5)"
        >
          <span>
            {{ countdownToDate(appointmentDate) }}
          </span>
        </v-chip>

      </v-img>

      <v-card-title class="text-truncate d-block pa-1">
        {{ appointment.appointment.appointment_location.name }}
        {{ appointment.appointment.appointment_location.locality }},
        {{ appointment.appointment.appointment_location.administrative_area_level_1 }}
        {{ appointment.appointment.appointment_location.postal_code}}
      </v-card-title>

      <v-card-text class="pa-1 pt-0">
        {{ dayjs(appointment.appointment.date_time).format ('MMM DD, YYYY') }}
        @ {{ dayjs(appointment.appointment.date_time).format ('h:mm A') }}
      </v-card-text>

      <!-- Claim button -->
      <v-btn
        icon
        @click="claimThisAppointment(appointment)"
        :disabled="!isUserAuthenticated"
      >
        <v-icon dense class="pa-2">
          {{ appointmentStatus === 'claimed' ? 'fas fa-star' : 'far fa-star' }}
        </v-icon>
      </v-btn>

      <!-- Share button -->
      <v-btn icon disabled>
        <v-icon dense class="pa-2">
          fas fa-share-alt
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
    },
    appointmentDate() {
      return this.appointment.appointment.date_time
    }
  },
  watch: {},
  methods: {
    async claimThisAppointment(appointment) {

      // only temporary until CLAIMED tab is ready
      appointment.status = this.appointmentStatus === 'claimed' ? 'unclaimed' : 'claimed'
      appointment.claimedBy = this.authenticatedUser

      await updateAppointment(appointment)

      // Refresh appointments tab
      this.$store.commit('refreshAppointments')

      // Refresh claimed tab
      this.$store.commit('refreshClaimedAppointments')
    },
    countdownToDate(appointmentDate) {
      let today = this.dayjs()
      let countdown = today.to(appointmentDate)
      return countdown
    }
  }
}
</script>

<style scoped>

</style>
