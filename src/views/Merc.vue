<template>
  <v-row no-gutters>
    <MobileTopNavigation
      v-if="isMobile"
    />

    <!-- Map -->
    <MercMap
      class="pa-0 ma-0 col-xs-12 col-md-8 order-1"
      style="z-index: 0"
      v-if="mapViewToggle"
      :class="isMobile ? 'shim-map' : 'no-shim-map'"
    />

    <!-- Tabs -->
    <MercList
      v-if="listViewToggle"
      :isMobile="isMobile"
    >

    </MercList>

    <MobileBottomNavigation
      v-if="isMobile"
      class="order-3"
    />

  </v-row>
</template>

<script>
import MercMap from '@/components/Merc/MercMap'
import MobileBottomNavigation from '@/components/Merc/MobileBottomNavigation';
import MobileTopNavigation from '@/components/Merc/MobileTopNavigation';
import MercList from '@/components/Merc/MercList';

export default {
  name: 'Merc',
  props: {},
  components: { MercList, MobileTopNavigation, MobileBottomNavigation, MercMap },
  data() {
    return {
      //
    }
  },
  created() {},
  destroyed() {},
  async mounted() {},
  computed: {
    isMobile() {
      //TODO instead of using these static mutations use the - <v-btn value="map-view"> from MobileBottomNavigation
      // When isMobile() changes to false, reset toggles
      if (!this.$vuetify.breakpoint.mobile) {
        this.$store.commit("updateMapViewToggle", true);
        this.$store.commit("updateListViewToggle", true);
      }

      // When isMobile() changes to true, hide list view, show map view
      if (this.$vuetify.breakpoint.mobile) {
        this.$store.commit("updateMapViewToggle", true);
        this.$store.commit("updateListViewToggle", false);
      }

      return this.$vuetify.breakpoint.mobile
    },
    listViewToggle() {
      return this.$store.state.listViewToggle
    },
    mapViewToggle() {
      return this.$store.state.mapViewToggle
    }
  },
  watch: {},
  sockets: {},
  methods: {}
}
</script>

<style scoped>
.no-shim-map {
  height: calc(100vh - 0px) !important;
}
.shim-map {
  margin-top: 48px !important;
  height: calc(100vh - 83px) !important;
}
</style>
