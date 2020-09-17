<template>
  <v-app>
    <v-app-bar app dense fixed shrink-on-scroll elevate-on-scroll
      scroll-threshold="500"
      src="@/assets/images/bluefire-header-img.jpg"
      style="z-index: 20"
      class="cust-border"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to bottom right, rgba(0,0,0,.2), rgba(0,0,0,1)"
        />
      </template>

      <router-link to="/" class="mr-4">
        <v-img  max-width="50" class="mt-1" style="transform: rotate(-20deg)"
          src="@/assets/images/bluefire-logo-final.png"/>
      </router-link>

      <v-card class="d-flex align-center align-self-center transparent elevation-0 mb-2">
        <v-card v-for="(page, key) in pages" :key="key" :to="page.href"
                class="transparent pa-2 elevation-0">
          <v-icon :color="page.color" size="1.em" class="mr-2">
            {{ page.icon }}
          </v-icon>

          <span class="subtitle-2 ml-1">{{ page.title }}</span>

        </v-card>
      </v-card>

      <v-spacer />

      <UserProfile></UserProfile>

    </v-app-bar>

    <v-sheet
      id="scrolling-techniques-5"
      class="overflow-y-auto"
    >
      <!-- MAIN CONTENT -->
      <v-content>
        <transition
          name="page-fade"
          mode="out-in"
        >
          <router-view />
        </transition>
      </v-content>

      <!-- Bootom: located in common/ -->
      <BottomBar />

    </v-sheet>

  </v-app>
</template>
<script>
import BottomBar from "@/common/BottomBar"
import UserProfile from '@/components/UserProfile/UserProfile'

export default {
  name: "App",
  components: {UserProfile, BottomBar },
  props: {
    source: String
  },
  computed: {
    pages () {
      return this.$store.state.pages
    }
  },
  data() {
    return {}
  },
  created() {},
  destroyed() {},
  mounted() {},
  methods: {}
};
</script>

<style scoped>
.cust-border {
  border-bottom: 1px solid #343536
}
</style>

