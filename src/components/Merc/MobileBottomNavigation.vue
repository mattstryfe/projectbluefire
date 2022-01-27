<template>
  <v-bottom-navigation v-model="value" color="success" class="cust-height">
    <v-btn value="list-view">
      <v-icon @click="listViewToggle = !listViewToggle">fa-list</v-icon>
    </v-btn>

    <v-btn value="map-view">
      <v-icon @click="mapViewToggle = !mapViewToggle">fa-globe</v-icon>
    </v-btn>

    <UserProfile value="user-profile"/>

    <v-btn value="back-home" :to="'/'">
      <v-icon >fa-ellipsis-v</v-icon>
    </v-btn>

  </v-bottom-navigation>
</template>

<script>
import UserProfile from '@/components/UserProfile/UserProfile';
export default {
  name: 'MobileBottomNavigation',
  props: {},
  components: { UserProfile },
  data() {
    return {
      value: 'map-view'
      //
    };
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    mapViewToggle: {
      get() {
        return this.$store.state.mapViewToggle
      },
      set(val) {
        this.$store.commit("updateMapViewToggle", val);
        this.$store.commit("updateListViewToggle", !val);
      }
    },
    listViewToggle: {
      get() {
        return this.$store.state.listViewToggle
      },
      set(val) {
        this.$store.commit("updateListViewToggle", val);
        this.$store.commit("updateMapViewToggle", !val);
      }
    }
  },
  watch: {},
  methods: {},
};
</script>

<style scoped>
.cust-height {
  height: 35px!important;
}
</style>
