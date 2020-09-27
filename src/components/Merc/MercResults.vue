<template>
  <v-sheet>
    <h4 class="my-2"> Appointments </h4>
    <v-btn @click="refreshAppointments">
      Refresh Appointments
    </v-btn>

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
    this.$store.commit('refreshAppointments')
  },
  computed: {
    appointments() {
      return this.$store.state.appointments
    }
  },
  watch: {},
  methods: {
    refreshAppointments() {
      this.$store.commit('refreshAppointments')
    }
  }
}
</script>

<style scoped>
</style>
