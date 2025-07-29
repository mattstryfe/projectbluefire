<template>
  <v-fab-transition>
    <v-sheet class="col-sm-6 px-1 my-1 col-12">
      <v-img contain src="@/assets/images/card-placeholder.jpg">
        <v-chip text-color="white" color="rgba(197,17,98,.5)">
          <span>
            {{ countdownToDate(appointmentDate) }}
          </span>
        </v-chip>
      </v-img>

      <v-card-title class="text-truncate d-block pa-1">
        {{ appointment.properties.appointment_location.name }}
        {{ appointment.properties.appointment_location.locality }},
        {{
          appointment.properties.appointment_location
            .administrative_area_level_1
        }}
        {{ appointment.properties.appointment_location.postal_code }}
      </v-card-title>

      <v-card-text class="text-truncate d-block caption pa-1 pt-0">
        {{ dayjs(appointment.properties.date_time).format('MMM DD, YYYY') }}
        @ {{ dayjs(appointment.properties.date_time).format('h:mm A') }}
      </v-card-text>

      <!-- Action buttons -->
      <MercCardActionButtons
        :appointment="appointment"
        :appointmentStatus="appointmentStatus"
      />
    </v-sheet>
  </v-fab-transition>
</template>

<script>
import MercCardActionButtons from '@/components/Merc/MercCardActionButtons'
import { mapGetters } from 'vuex'

export default {
  name: 'MercCard',
  props: {
    appointment: {
      type: Object,
      required: true
    }
  },
  components: { MercCardActionButtons },
  data() {
    return {
      //
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    ...mapGetters(['isUserAuthenticated', 'authenticatedUser']),
    appointmentStatus() {
      return this.appointment.properties.status
    },
    appointmentDate() {
      return this.appointment.properties.date_time
    }
  },
  watch: {},
  methods: {
    countdownToDate(appointmentDate) {
      let today = this.dayjs()
      return today.to(appointmentDate)
    }
  }
}
</script>

<style scoped></style>
