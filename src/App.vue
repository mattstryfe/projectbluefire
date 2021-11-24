<template>
  <v-app>
    <v-app-bar app dense fixed elevate-on-scroll
      :shrink-on-scroll="this.$route.name !== 'merc'"
      scroll-threshold="500"
      src="@/assets/images/bluefire-header-img.jpg"
      style="z-index: 20"
      class="c-border-b"
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

      <v-sheet class="d-flex align-center align-self-center transparent elevation-0 mb-2">
        <v-card
          v-for="(page, key) in pages"
          :key="key"
          :to="page.href"
          class="transparent pa-2 elevation-0"
        >
          <v-btn fab x-small color="transparent">
            <v-icon :color="page.color">
              {{ page.icon }}
            </v-icon>
          </v-btn>


          <span class="subtitle-2 ml-1" v-show="!isMobile">
            {{ page.title }}
          </span>

        </v-card>
      </v-sheet>

      <v-spacer />

      <UserProfile></UserProfile>

    </v-app-bar>

    <!-- MAIN CONTENT -->
    <v-main
      id="scrolling-techniques-5"
      :class="this.$route.name === 'merc' ? ' ' : 'overflow-y-auto'"
    >
      <transition
        name="page-fade"
        mode="out-in"
      >
        <router-view />
      </transition>
    </v-main>

    <!-- Bootom: located in common/ -->
    <BottomBar v-if="this.$route.name !== 'merc'"/>

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
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
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
  methods: {},
  watch:{}
};
</script>

<style>
html { overflow-y: auto }

</style>

