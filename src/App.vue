<template>
  <v-app id="">
    <SideBar :drawer="drawer" />
    <AppBar />

    <!-- MAIN CONTENT -->
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>

    <!-- Bootom: located in common/ -->
    <Bottom />
  </v-app>
</template>
<script>
import Bottom from "@/common/Bottom";
import SideBar from "@/common/SideBar";
import AppBar from "@/common/AppBar";
export default {
  name: "App",
  components: { AppBar, SideBar, Bottom },
  props: {
    source: String
  },
  data() {
    return {
      drawer: true,
      dialog: false
    };
  },
  created() {},
  methods: {}
};
</script>

<style scoped></style>
