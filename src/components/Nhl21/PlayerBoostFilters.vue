<template>
  <v-row class="px-1 my-4 mx-1">
    <h5 class="mt-1">Filter by:</h5>
    <v-chip
      class="mx-1 "
      close outlined
      v-for="boostFilter in boostFilters" :key="boostFilter"
      @click:close="remove(boostFilter)"
    >
      <v-icon size="15" color="red" class="mr-1">
        {{ determineIcon(boostFilter)}}
      </v-icon>

      <!-- this is the same as nhl21.vue look to refactor -->
      {{ decodeStat(boostFilter) }}

    </v-chip>
  </v-row>
</template>

<script>
import { traitKey } from '@/templates/nhl21/offense'

export default {
  name: 'PlayerBoostFilters',
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
    boostFilters: {
      get() {
        return this.$store.state.boostFilters
      },
      set(val) {
        this.$store.commit('updateBoostFilters', val)
      }
    }
  },
  watch: {},
  methods: {
    decodeStat(val) {
      const { [val]: stat } = traitKey
      return stat
    },
    remove(boostFilter) {
      this.boostFilters = this.boostFilters.filter(b => b !== boostFilter)
    },
    determineIcon() {
      return 'fa-bullseye'
    },
  }
}
</script>

<style scoped>
>>>.theme--dark.v-chip {
  border: 2px solid #343536;
}

</style>
