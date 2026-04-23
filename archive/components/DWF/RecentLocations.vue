<template>
  <v-row no-gutters>
    <v-col cols="12">
      <span class="caption ml-2">Recent Locations</span>
    </v-col>
    <v-chip
      outlined
      v-for="(location, i) in recentLocations"
      :key="location.zipcode"
      class="ma-1"
      :class="{ 'c-border-a-green': selectedLocationIndex === i }"
      @click="useThisLocation(location, i)"
    >
      {{ shortName(location) }}, {{ state(location) }}
    </v-chip>
  </v-row>
</template>

<script>
import { getAllRecentLocations } from '@/services/DWFServices'

export default {
  name: 'RecentLocations',
  props: {},
  components: {},
  data() {
    return {
      selectedLocationIndex: null,
      recentLocations: null
    }
  },
  async created() {
    // load recent locations
    this.recentLocations = await getAllRecentLocations(5)
  },
  destroyed() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    shortName(location) {
      return location.address_components[1].short_name
    },
    state(location) {
      const area = location.address_components.filter((comp) =>
        comp.types.includes('administrative_area_level_1')
      )
      return area[0].short_name
    },
    useThisLocation(location, i) {
      this.selectedLocationIndex = i
      this.$store.commit('updateRecentLocation', location)
    }
  }
}
</script>

<style scoped></style>
