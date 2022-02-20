<template>
  <v-row no-gutters>
    <MobileTopNavigation
      v-if="isMobile"
    />

    <!-- Map -->
    <MercMap
      class="pa-0 ma-0 col-xs-12 col-md-8 order-1"
      style="z-index: 0"
      v-if="mercView === 'map-view' || mercView === 'all'"
      :class="isMobile ? 'shim-map' : 'no-shim-map'"
    />

    <!-- Tabs -->
    <MercList
      v-if="mercView === 'list-view' || mercView === 'all'"
      :isMobile="isMobile"
    />

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
    mercView(){
      return this.$store.state.mercView
    },
    isMobile() {
      if (!this.$vuetify.breakpoint.mobile)
        this.$store.commit("updateMercViewTo", 'all')

      console.log('isMobile', this.$vuetify.breakpoint.mobile)
      return this.$vuetify.breakpoint.mobile

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
