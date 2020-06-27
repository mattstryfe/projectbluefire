<template>
  <v-footer app>
    <v-col cols="12" class="pa-1 ma-0 text-center">
      <p>
        &copy;2020 - Project <span class="blue--text text--lighten-2">Bluefire</span>
      </p>

      <div class="d-inline-flex" v-for="icon in footerIcons" :key="icon.icon">
        <v-btn icon class="mx-3 white--text">
          <v-icon size="2em" :color="icon.color">{{ icon.icon }}</v-icon>
        </v-btn>

        <v-divider class="mx-4" inset vertical></v-divider>
      </div>

      <a href="https://buttercms.com"
        ><img class="butter" src="./../assets/butter-w.png" align="bottom"
      /></a>

    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: "BottomBar",
  data () {
    return {
      footerIcons: [
        { icon: 'fab fa-facebook',    color: 'blue' },
        { icon: 'fab fa-twitter',     color: 'blue lighten-2' },
        { icon: 'fab fa-linkedin',    color: 'blue' }
      ]
    }
  },
  props: []
}
</script>

<style scoped>
.butter {
  width: 140px;
  margin-bottom: -10px;
}
</style>
