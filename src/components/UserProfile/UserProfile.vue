<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x offset-y
    class="cust-z"
    :disabled="!isUserAuthenticated"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        class="mr-2 align-self-center justify-center"
        v-bind="attrs"
        v-on="on"
      >
        <!-- before login -->
        <span
          v-if="!isUserAuthenticated && !attemptingToAuthenticate"
          @click="userLogin()"
        >
          <v-icon size="25" color="grey">
            fa-user-circle
          </v-icon>
        </span>

        <!-- during login -->
        <v-progress-circular
          v-if="!isUserAuthenticated && attemptingToAuthenticate"
          :width="3"
          color="blue lighten-2"
          indeterminate
        />

        <!-- after login -->
        <v-avatar v-if="isUserAuthenticated">
          <v-img
            :src="authenticatedUser.avatar"
            max-width="40"
            max-height="40"
          />
        </v-avatar>
      </v-btn>

    </template>

    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar >
            <v-img
              v-if="isUserAuthenticated"
              :src="authenticatedUser.avatar"
              :alt="authenticatedUser.name"
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ authenticatedUser.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-truncate d-inline-block">{{ authenticatedUser.email }}</v-list-item-subtitle>
          </v-list-item-content>

        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer/>

        <v-btn text @click="menu = false">Close</v-btn>
        <v-btn text @click="userLogout()" :disabled="!isUserAuthenticated">Logout</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'UserProfile',
  props: {},
  components: {},
  data() {
    return {
      menu: false
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    authenticatedUser() {
      return this.$store.state.authenticatedUser
    },
    isUserAuthenticated() {
      return this.$store.state.isUserAuthenticated
    },
    attemptingToAuthenticate() {
      return this.$store.state.attemptingToAuthenticate
    }
  },
  watch: {},
  methods: {
    userLogout() {
      this.$store.dispatch('userLogout')

      // close menu
      this.menu = false
    },
    userLogin() {
      this.$store.dispatch('userLogin')
    },
  }
}
</script>

<style scoped>
.cust-z {
  z-index: 900;
}
</style>
