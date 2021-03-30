<template>
  <v-row no-gutters class="px-1">
    <h1>Fantasy Hockey</h1>
    <v-btn
      icon
      :href="yahooRequestToken"
    >
      <v-icon color="red">
        fab fa-yahoo
      </v-icon>
    </v-btn>

  </v-row>
</template>

<script>
export default {
  name: "Fantasy",
  props: {},
  components: {},
  data () {
    return {
      params: {
        client_id: 'dj0yJmk9VXRlemtxcHpXQmpqJmQ9WVdrOVZXeEhkekV6TjBFbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWZm',
        redirect_uri: 'https://projectbluefire.com',
        response_type: 'code',
        language: 'en-us'
      }
    }
  },
  created () { },
  destroyed () { },
  mounted () {
  },
  computed: {
    code() {
      return this.$route.query.code
    },
    yahooRequestToken() {
      // Build query params using encode
      // Shamelessly stolen from stack
      // https://stackoverflow.com/questions/8135132/how-to-encode-url-parameters
      const encodeGetParams = p =>
        Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");

      return process.env.VUE_APP_YAHO_BASE_ENDPOINT + encodeGetParams(this.params)
    }
  },
  watch: { },
  methods: { }
}
</script>

<style scoped>

</style>

