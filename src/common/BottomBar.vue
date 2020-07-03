<template>
  <v-footer class="py-0">
    <v-row class="justify-center">
      <v-col>
        <span>
          &copy;2020 - Project <span class="blue--text text--lighten-2">Bluefire</span>
        </span>
      </v-col>
    </v-row>
    <v-row class="justify-end">
      <v-btn icon class="mx-3 white--text" v-for="icon in footerIcons" :key="icon.icon">
        <v-icon size="2em" :color="icon.color">{{ icon.icon }}</v-icon>
      </v-btn>
    </v-row>
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
