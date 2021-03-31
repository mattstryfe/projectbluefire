<template>
  <v-row no-gutters class="px-1">
    <h1>Fantasy Hockey</h1>
    <v-btn
      icon
      :href="authUrl"
    >
      <v-icon color="red">
        fab fa-yahoo
      </v-icon>

    </v-btn>
    <span>code: {{ code }}</span>

    <v-btn
      icon
      @click="getTokenUrl"
    >
      <v-icon color="green">
        fab fa-yahoo
      </v-icon>
    </v-btn>

  </v-row>
</template>

<script>
import { yahooRequestToken } from '@/services/BasicServices'

export default {
  name: "Fantasy",
  props: {},
  components: {},
  data () {
    return {
      gotCode: false,
      paramsToken: {
        client_id: process.env.VUE_APP_YAHOO_CLIENT_ID,
        client_secret: process.env.VUE_APP_YAHOO_CLIENT_SECRET,
        code: this.code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://projectbluefire.com',
      },
      paramsAuth: {
        client_id: process.env.VUE_APP_YAHOO_CLIENT_ID,
        redirect_uri: 'https://projectbluefire.com',
        response_type: 'code',
        language: 'en-us'
      }
    }
  },
  created () { },
  destroyed () { },
  mounted () {
    // if (this.code)
    //   yahooRequestToken(this.code)
  },
  computed: {
    code() {
      return this.$route.query.code
    },
    tokenUrl() {
      const paramsToken = {
          client_id: process.env.VUE_APP_YAHOO_CLIENT_ID,
          client_secret: process.env.VUE_APP_YAHOO_CLIENT_SECRET,
          code: this.code,
          grant_type: 'authorization_code',
          redirect_uri: 'https://projectbluefire.com',
      }
      // Build query params using encode
      // Shamelessly stolen from stack
      // https://stackoverflow.com/questions/8135132/how-to-encode-url-parameters
      const encodeGetParams = p =>
        Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");

      return process.env.VUE_APP_YAHO_REQ_TOKEN + encodeGetParams(paramsToken)
    },
    authUrl() {
      // Build query params using encode
      // Shamelessly stolen from stack
      // https://stackoverflow.com/questions/8135132/how-to-encode-url-parameters
      const encodeGetParams = p =>
        Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");

      return process.env.VUE_APP_YAHO_REQ_AUTH + encodeGetParams(this.paramsAuth)
    }
  },
  // beforeRouteUpdate(to, from, next) {
  //   console.log('before')
  //   next()
  // },
  // watch: {
  //   gotCode(newVal, oldVal) {
  //     console.log('newcode', newVal)
  //   },
  //   code(newCode, oldCode) {
  //     console.log('code', newCode)
  //   }
  // },
  methods: {
    async getTokenUrl(){
      const token = await yahooRequestToken(this.code)
      console.log('token', token)
    }
  }
}
</script>

<style scoped>

</style>

