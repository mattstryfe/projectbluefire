<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x offset-y
    class="cust-z"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon class="mr-5 mt-5"
        v-bind="attrs"
        v-on="on"
      >
        <span v-if="!isSignedIn" @click="launchAuthentication()">Log In</span>
        <v-avatar v-else>
          <v-img :src="user_avatar"></v-img>
        </v-avatar>
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar >
            <v-img v-if="isSignedIn"
                 :src="user_avatar"
                 :alt="user_name"
            />
            <v-progress-circular
              v-else
              :width="3"
              color="blue lighten-2"
              indeterminate
            ></v-progress-circular>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user_name }}</v-list-item-title>
            <v-list-item-subtitle>{{ user_email }}</v-list-item-subtitle>
          </v-list-item-content>

<!--          <v-list-item-action>-->
<!--            <v-btn-->
<!--              :class="fav ? 'red&#45;&#45;text' : ''"-->
<!--              icon-->
<!--              @click="fav = !fav"-->
<!--            >-->
<!--              <v-icon>mdi-heart</v-icon>-->
<!--            </v-btn>-->
<!--          </v-list-item-action>-->
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="menu = false">Close</v-btn>
        <v-btn text @click="logout()" :disabled="!isSignedIn">Logout</v-btn>
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
      isSignedIn: false,
      user_avatar: null,
      user_name: null,
      user_email: null,
      user_id: null,
      menu: false
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    async logout() {
      // close menu
      this.menu = false

      // log user out
      await this.$gAuth.signOut()

      // flip sign in toggle
      this.isSignedIn = this.$gAuth.isAuthorized

      // clear all user data once signed out
      this.user_name = null
      this.user_avatar = null
      this.user_email = null
    },
    async launchAuthentication() {
      let googleUser
      try {
        googleUser = await this.$gAuth.signIn()
        this.isSignedIn = this.$gAuth.isAuthorized

        // Pull out user info
        this.user_id = googleUser.getId()
        const { PK, Cd, yu } = googleUser.getBasicProfile()
        this.user_avatar = PK
        this.user_name = Cd
        this.user_email = yu
      }
      catch (e) {
        if (e.error === 'popup_closed_by_user') {
          this.menu = false
          return
        }
      }

      console.log('googleID', this.user_id, ' is signed in? ', this.isSignedIn)
    },
  }
}
</script>

<style scoped>
.cust-z {
  z-index: 900;
}
</style>
