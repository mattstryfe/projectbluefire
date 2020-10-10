<template>
  <v-sheet>
    <!-- refresh icon (for testing only) -->
    <v-row>
      <v-spacer/>
      <v-btn class="mr-2" icon :disabled="!isUserAuthenticated" @click="refreshClaimedAppointments">
        <v-icon>fa-sync</v-icon>
      </v-btn>
    </v-row>

    <!-- login warning -->
    <v-alert
      outlined text
      v-show="!isUserAuthenticated"
      color="info"
      class="ma-0 pa-2"
      type="info"
    >
      <span>Login to display claimed appointments!</span>
    </v-alert>

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
  methods: {
    refreshClaimedAppointments() {
      this.$store.dispatch('refreshClaimedAppointments')
    }
  }
}
</script>

<style scoped>

</style>
