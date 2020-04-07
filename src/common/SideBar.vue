<template>
  <v-navigation-drawer
    app
    fixed
    width="200"
    :clipped="$vuetify.breakpoint.lgAndUp"
    :mini-variant.sync="mini"
    mini-variant-width="80"
  >
    <v-list
      nav
      dense
      v-for="item in items"
      :key="item.text"
    >
      <v-list-item link :to="item.href" >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'SideBar',
  components: {},
  props: {},
  data () {
    return {
      mini: true,
      items: [
        {icon: 'fa-home', text: 'Home', href: '/'},
        {icon: 'fa-cloud-download-alt', text: 'SWF', href: '/swf'},
        {icon: 'fa-tools', text: 'Projects', href: '/projects'},
        {icon: 'fa-comment-dots', text: 'Blog', href: '/blog'}
      ]
    }
  },
  computed: {},
  created () {}
}
</script>

<style scoped>
</style>
