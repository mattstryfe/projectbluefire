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
import MercMap from '@/components/MercMap/MercMap'
import MercForm from '@/components/MercForm/MercForm'
import MercResults from '@/components/MercResults/MercResults'

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
      ],
    //
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {},
  watch: {},
  sockets: {},
  methods: {
    async getUserLocation() {
      this.$socket.emit('ping', location);

      // const { lat, lng } = await this.$getLocation()
      // this.userLoc = {lat, lng}
      // console.log('this.userLoc', this.userLoc)
      // this.$socket.emit("ping", this.userLoc);
      //
      if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(position => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('emitting!', this.$socket)
          this.$socket.emit("ping", location);
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
