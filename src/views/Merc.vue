<template>
  <v-row no-gutters>
    <MobileTopNavigation v-if="isMobile"/>

    <!-- Map -->
    <MercMap
      class="pa-0 ma-0 col-xs-12 col-md-8 order-1"
      style="z-index: 0"
      v-if="mapViewToggle"
      :class="isMobile ? 'shim-map' : 'no-shim-map'"
    />

    <!-- Tabs -->
    <v-sheet
      class="pa-0 pr-0 col-sm-12 col-md-4 order-2"
      v-if="listViewToggle"
    >
      <v-tabs
        v-model="drawer_tab"
        background-color="primary"
        dark
      >
        <v-tab
          v-for="(tab, ind) in drawerTabs"
          :key="tab.name"
        >
          <v-badge
            color="blue darken-1 font-weight-bold "
            offset-y="10"
            :content="countResultsIn(tab.name)"
            :value="isVisible(tab.name)"
          >
            <v-icon :color="drawer_tab === ind ? 'success' : 'grey darken-2'">{{ tab.icon }}</v-icon>
          </v-badge>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="drawer_tab">
        <v-tab-item
          v-for="tab in drawerTabs"
          :key="tab.name"
        >
          <v-sheet
            class="overflow-x-hidden px-2"
            :class="isMobile ? 'shim-bottom-navigation' : 'no-shim'"
          >

            <component :is="tab.content" />

          </v-sheet>
        </v-tab-item>
      </v-tabs-items>
    </v-sheet>

    <MobileBottomNavigation v-if="isMobile" class="order-3" />

  </v-row>
</template>

<script>
import MercMap from '@/components/Merc/MercMap'
import MercResults from '@/components/Merc/MercResults'
import MercForm from '@/components/Merc/MercForm'
import MercClaimed from '@/components/Merc/MercClaimed'
import MobileMapListToggle from '@/components/Merc/MobileMapListToggle'
import MobileBottomNavigation from '@/components/Merc/MobileBottomNavigation';
import MobileTopNavigation from '@/components/Merc/MobileTopNavigation';

export default {
  name: 'Merc',
  props: {},
  components: {MobileTopNavigation, MobileBottomNavigation, MobileMapListToggle, MercMap },
  data() {
    return {
      drawer_tab: null,
      drawerTabs: [
        { name: 'results', icon: 'fa-search-plus', content: MercResults },
        { name: 'form', icon: 'fa-plus', content: MercForm },
        { name: 'claimed', icon: 'fa-star', content: MercClaimed }
      ]
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
    mapViewToggle() {
      return this.$store.state.mapViewToggle
    },
    listViewToggle() {
      return this.$store.state.listViewToggle
    }
  },
  watch: {},
  sockets: {},
  methods: {
    countResultsIn(tab) {
      if(tab === 'results')
        return this.$store.state.appointments.length
      if(tab === 'claimed')
        return this.$store.state.claimedAppointments.length
    },
    isVisible(tab) {
      if (tab === 'form')
        return false
      if (tab === 'claimed' && this.$store.state.claimedAppointments.length === 0)
        return false

      return true

    }
  }
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

.no-shim {
  height: calc(100vh - 48px) !important;
}
.shim-bottom-navigation {
  height: calc(100vh - 84px) !important;
}
</style>
