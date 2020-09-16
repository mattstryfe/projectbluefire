<template>
  <v-container fluid>
    <v-row>
      <!-- Main Merc Map -->
      <MercMap />

      <!-- Tabs -->
      <v-navigation-drawer absolute right width="25%">
        <v-card>
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
        </v-card>
      </v-navigation-drawer>

    </v-row>
  </v-container>
</template>

<script>
import MercMap from '@/components/Merc/MercMap'
import MercResults from '@/components/Merc/MercResults'
import MercForm from '@/components/Merc/MercForm'

export default {
  name: 'Merc',
  props: {},
  components: { MercMap },
  data() {
    return {
      drawer_tab: null,
      drawerTabs: [
        { name: 'results', icon: 'fa-search-plus', content: MercResults },
        { name: 'form', icon: 'fa-plus', content: MercForm }
      ]
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {},
  watch: {},
  sockets: {},
  methods: {}
}
</script>

<style scoped>

</style>
