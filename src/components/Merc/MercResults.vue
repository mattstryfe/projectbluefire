<template>
  <v-sheet>
    <!-- refresh icon (for testing only) -->
    <v-row>
      <v-spacer/>
      <v-btn class="mr-2" icon @click="refreshAppointments">
        <v-icon>fa-sync</v-icon>
      </v-btn>
    </v-row>

    <!-- Cards -->
    <v-row no-gutters class="px-1">
      <MercCard
        v-for="appointment in appointments"
        :key="appointment.id"
        :appointment="appointment"
      />
    </v-row>
  </v-sheet>
</template>

<script>
import MercCard from '@/components/Merc/MercCard'

export default {
  name: "MercResults",
  props: {},
  components: { MercCard },
  data () {
    return {
      //
    }
  },
  created () {},
  destroyed () {},
  mounted () {
    this.$store.dispatch('refreshAppointments')
    // this.$store.commit('refreshAppointments')
  },
  computed: {
    appointments() {
      return this.$store.state.appointments
    }
  },
  watch: {},
  methods: {
    refreshAppointments() {
      this.$store.dispatch('refreshAppointments')
      // this.$store.commit('refreshAppointments')
    }
  }
}
</script>

<style scoped>
</style>
