<template>
  <v-sheet>

    <!-- login warning -->
    <v-alert
      outlined text
      v-if="!isUserAuthenticated"
      color="info"
      class="ma-0 pa-2 mt-2"
      type="info"
    >
      <span>Login to display claimed appointments!</span>
    </v-alert>

    <!-- Logged in but claimed === 0 warning -->
    <v-alert
      outlined text
      v-if="isUserAuthenticated && claimedAppointments.length === 0"
      color="info"
      class="ma-0 pa-2 mt-2"
      type="info"
    >
      <span>You have no claimed appointments!</span>
    </v-alert>


    <!-- Cards -->
    <v-row no-gutters class="px-1 mt-2">
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
  mounted() {
    this.$store.dispatch('refreshClaimedAppointments')
  },
  computed: {
    claimedAppointments() {
      return this.$store.state.claimedAppointments
    },
    isUserAuthenticated() {
      return this.$store.state.isUserAuthenticated
    }
  },
  watch: {},
  methods: {}
}
</script>

<style scoped>

</style>
