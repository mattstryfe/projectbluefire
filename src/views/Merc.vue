<template>
  <v-row no-gutters>

    <!-- Map -->
    <MercMap
      class="pa-0 ma-0 col-xs-12 col-md-8 order-1 order-sm-2"
      style="z-index: 0"
      v-show="!isMobile"
    />

    <!-- Tabs -->
    <v-sheet
        class="pa-0 pr-0 col-sm-12 col-md-4 order-sm-1 order-md-2"
      >
      <MobileMapListToggle v-show="isMobile"/>

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
              style="height: calc(100vh - 96px)"
            >

              <component :is="tab.content"></component>

            </v-sheet>
          </v-tab-item>
        </v-tabs-items>

    </v-sheet>

  </v-row>
</template>

<script>
import MercMap from '@/components/Merc/MercMap'
import MercResults from '@/components/Merc/MercResults'
import MercForm from '@/components/Merc/MercForm'
import MercClaimed from '@/components/Merc/MercClaimed'
import MobileMapListToggle from '@/components/Merc/MobileMapListToggle'

export default {
  name: 'Merc',
  props: {},
  components: {MobileMapListToggle, MercMap },
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
      return this.$vuetify.breakpoint.mobile
    },
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

</style>
