<template>
  <v-sheet>
    <h4>Claimed Appointments</h4>
    <v-btn @click="refreshClaimedAppointments">
      Refresh Appointments
    </v-btn>

    <!-- Cards -->
    <v-row no-gutters class="px-1">
      <MercCard
        v-for="claimedAppointment in claimedAppointments"
        :key="claimedAppointment.id"
        :appointment="claimedAppointment"
      />
    </v-row>
  </v-sheet>
</template>

<script>
import MercCard from '@/components/Merc/MercCard'

export default {
  name: 'MercClaimed',
  props: {},
  components: { MercCard },
  data() {
    return {
      //
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    claimedAppointments() {
      return this.$store.state.claimedAppointments
    }
  },
  watch: {},
  methods: {
    refreshClaimedAppointments() {
      this.$store.commit('refreshClaimedAppointments')
      // console.log('this.appointments', this.appointments)
    }
  }
}
</script>

<style scoped>

</style>
