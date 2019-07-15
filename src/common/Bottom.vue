<template>
  <v-footer
    height="auto"
    :inset="true"
    :app="true"
    class="indigo lighten-1 white--text text-xs-center"
  >
    <v-layout row wrap justify-center>
      <v-card
        flat
        tile
        class="indigo lighten-1 white--text text-xs-center"
      >
        <v-card-text>
          &copy;2018 <strong>Project Bluefire</strong>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            icon
            class="mx-3 white--text"
          >
            <v-icon size="24px">{{ icon }}</v-icon>
          </v-btn>
          <a href="https://buttercms.com"><img class="butter" src="./../assets/butter-w.png" align="middle"></a>
        </v-card-text>

      </v-card>
    </v-layout>
  </v-footer>
</template>

<script>
export default {
  name: 'bottom',
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
