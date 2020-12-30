<template>
  <v-sheet>
    <!-- Cards -->
    <v-row no-gutters class="px-1 mt-2">
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
  },
  computed: {
    appointments() {
      return this.$store.state.appointments
    }
  },
  watch: {},
  methods: {}
}
</script>

<style scoped>
</style>
