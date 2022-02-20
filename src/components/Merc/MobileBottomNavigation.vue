<template>
  <v-bottom-navigation
    fixed
    v-model="mercView"
    color="success"
    class="cust-height"
  >
    mercView: {{ mercView }}
<!--    <v-btn value="list-view">
      <v-icon @click="listViewToggle = !listViewToggle">fa-list</v-icon>
    </v-btn>

    <v-btn value="map-view">
      <v-icon @click="mapViewToggle = !mapViewToggle">fa-globe</v-icon>
    </v-btn>-->

    <v-btn value="list-view">
      <v-icon>
        fa-list
      </v-icon>
    </v-btn>

    <v-btn value="map-view">
      <v-icon>
        fa-globe
      </v-icon>
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
      // value: 'map-view'
      //
    };
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    mercView: {
      get() {
        return this.$store.state.mercView
      },
      set(view) {
        this.$store.commit("updateMercViewTo", view);
      }
    }
  },
  watch: {},
  methods: {},
};
</script>

<style scoped>
.cust-height {
  height: 35px !important;
}
</style>
