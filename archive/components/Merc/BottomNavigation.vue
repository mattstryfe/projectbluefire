<template>
  <v-bottom-navigation v-model="value" color="success" class="cust-height">
    <v-btn value="list-view">
      <v-icon>fa-list</v-icon>
    </v-btn>

    <v-btn value="map-view">
      <v-icon>fa-globe</v-icon>
    </v-btn>

    <UserProfile value="user-profile" />

    <v-btn value="back-home" :to="'/'">
      <v-icon>fa-ellipsis-v</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import UserProfile from '@/components/UserProfile/UserProfile'
export default {
  name: 'BottomNavigation',
  props: {},
  components: { UserProfile },
  data() {
    return {
      value: 'list-view'
      //
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style scoped>
.cust-height {
  height: 35px !important;
}
</style>
