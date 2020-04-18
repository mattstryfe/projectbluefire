<template>
  <v-app id="">
    <SideBar />
    <AppBar />

    <!-- MAIN CONTENT -->
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>

    <!-- Bootom: located in common/ -->
    <BottomBar />
  </v-app>
</template>
<script>
import BottomBar from "@/common/BottomBar";
import SideBar from "@/common/SideBar";
import AppBar from "@/common/AppBar";
export default {
  name: "App",
  components: { AppBar, SideBar, BottomBar },
  props: {
    source: String
  },
  data() {
    return {
      dialog: false
    };
  },
  created() {},
  methods: {}
};
</script>

<style scoped></style>
