<template>
  <v-sheet class="mb-2">
    <v-toolbar dense floating flat class="transparent elevation-0">

      <v-btn icon>
        <v-icon @click="toggleAddPOI = !toggleAddPOI">fa-bullseye</v-icon>
      </v-btn>

      <v-text-field
        hide-details
        prepend-icon="fa-search"
        single-line
      ></v-text-field>

    </v-toolbar>


    <v-expansion-panels multiple
      v-if="toggleAddPOI"
      v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header>Submit Request for Agent</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form ref="form"
            v-model="valid"
          >
            <v-row>
              <v-sheet v-for="(i, k) in formSchema" class="col-lg-3 col-6 pa-2" :key="k">
                <v-text-field outlined dense
                  v-model="formData[k]"
                  :placeholder="' '"
                  :label="i.label"
                />
              </v-sheet>

            </v-row>


          </v-form>

        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

  </v-sheet>

</template>

<script>
export default {
  name: 'MapControls',
  props: {},
  components: {},
  data() {
    return {
      toggleAddPOI: false,
      panel: [0, 1],
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      formData: {},
      formSchema: {
        submitter_name: {
          label: 'Submitter',
          type: 'text'
        },
        submitter_email: {
          label: 'Email',
          type: 'text',
        },
        client_name: {
          label: 'Client Name',
          type: 'text'
        },
        client_email: {
          label: 'Client Email',
          type: 'text'
        },
        date_entered: {
          label: 'Date Entered',
          type: 'text'
        },
        requested_destination: {
          label: 'Destination',
          type: 'text'
        },
        requested_date: {
          label: 'Date Requested',
          type: 'text'
        },
        requested_time: {
          label: 'Time Requested',
          type: 'text'
        }
      }
    }
  },
  created() {
  },
  destroyed() {
  },
  mounted() {
  },
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style scoped>

</style>
