<template>
  <v-container fluid>
    <v-row no-gutters>
      <!-- Main Merc Map -->
      <MercMap />

      <!-- Tabs -->
      <v-sheet
        class="col-sm-12 col-md-4 order-sm-1 order-md-2"
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
            <v-icon :color="drawer_tab === ind ? 'success' : 'grey darken-2'">{{ tab.icon }}</v-icon>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="drawer_tab">
          <v-tab-item
            v-for="tab in drawerTabs"
            :key="tab.name"
          >
            <v-sheet class="pa-2">

              <component :is="tab.content"></component>

            </v-sheet>
          </v-tab-item>
        </v-tabs-items>
      </v-sheet>

    </v-row>
  </v-container>
</template>

<script>
import MercMap from '@/components/Merc/MercMap'
import MercResults from '@/components/Merc/MercResults'
import MercForm from '@/components/Merc/MercForm'
import MercClaimed from '@/components/Merc/MercClaimed'

export default {
  name: 'Merc',
  props: {},
  components: { MercMap },
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
  mounted() {},
  computed: {},
  watch: {},
  sockets: {},
  methods: {
    refreshDataInTabs() {
      console.log('clicked!')
      // Refresh appointments tab
      this.$store.commit('refreshAppointments')

      // Refresh claimed tab
      this.$store.commit('refreshClaimedAppointments')
    }
  }
}
</script>

<style scoped>

</style>
