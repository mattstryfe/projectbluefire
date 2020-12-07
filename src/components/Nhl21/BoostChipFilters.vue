<template>
  <v-row class="px-1 my-4 mx-1">
    <h5>Filter by:</h5>
    <v-chip
      class="mx-1"
      close
      v-for="boostFilter in boostFilters" :key="boostFilter"
      @click:close="remove(boostFilter)"
    >
      {{ boostFilter }}
    </v-chip>
  </v-row>
</template>

<script>
export default {
  name: 'BoostChipFilters',
  props: {},
  components: {},
  data() {
    return {
      //
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    boostFilters() {
      return this.$store.state.boostFilters
    }
  },
  watch: {},
  methods: {
    remove(boostFilter) {
      this.boostFilters.splice(this.boostFilters.indexOf(boostFilter), 1)
    }
  }
}
</script>

<style scoped>

</style>
