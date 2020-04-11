<template>
  <v-navigation-drawer
    app
    fixed
    width="200"
    expand-on-hover
    :clipped="$vuetify.breakpoint.lgAndUp">


    <v-list
      nav
      dense
      v-for="page in pages"
      :key="page.title"
    >
      <v-list-item link :to="page.href" >
        <v-list-item-icon>
          <v-icon>{{ page.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ page.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'SideBar',
  components: {},
  props: {},
  computed:{
    pages () {
      return this.$store.state.pages
    }
  },
  created () {}
}
</script>

<style scoped>
</style>
