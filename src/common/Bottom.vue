<template>
  <v-footer app inset padless>
    <v-col cols="12" class="pa-0 ma-0 text-center">
      &copy;2019
      <strong>Project Bluefire</strong>
      <v-btn
        v-for="icon in icons"
        :key="icon"
        icon
        class="mx-3 white--text"
      >
        <v-icon size="24px">{{ icon }}</v-icon>
      </v-btn>
      <a href="https://buttercms.com"><img class="butter" src="./../assets/butter-w.png" align="middle"></a>
    </v-col>
  </v-footer>
</template>

<script>
  export default {
    name: 'Bottom',
    data: () => ({
      icons: ['fab fa-facebook', 'fab fa-twitter', 'fab fa-google-plus', 'fab fa-linkedin', 'fab fa-instagram']
    }),
    props: []
  }
</script>

<style scoped>
  .butter {
    width: 150px;
    margin-bottom: 7px;
  }
</style>
