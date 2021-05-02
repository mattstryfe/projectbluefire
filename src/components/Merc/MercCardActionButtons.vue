<template>
  <v-row no-gutters>
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
  </v-row>
</template>

<script>
import { updateAppointment } from '@/services/MercServices'
import { mapGetters } from 'vuex'

export default {
  name: 'MercCardActionButtons',
  props: {
    appointment: {
      type: Object,
      required: true
    },
    appointmentStatus: {
      type: String,
      default () {
        return 'unclaimed'
      }
    }
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
    ...mapGetters([
      'isUserAuthenticated',
      'authenticatedUser'
    ])
  },
  watch: {},
  methods: {
    async claimThisAppointment(appointment) {
      appointment.properties.status = this.appointmentStatus === 'claimed' ? 'unclaimed' : 'claimed'
      appointment.properties.claimedBy = this.authenticatedUser

      await updateAppointment(appointment)

      // Refresh appointments tab
      await this.$store.dispatch('refreshAppointments')

      // Refresh claimed tab
      await this.$store.dispatch('refreshClaimedAppointments')
    },
  }
}
</script>

<style scoped>

</style>
