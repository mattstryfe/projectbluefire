<template>
  <v-sheet class="mb-2">
    <v-toolbar dense floating flat class="transparent elevation-0">

      <v-btn icon>
        <v-icon @click="toggleAddPOI = !toggleAddPOI"
                :color="toggleAddPOI ? 'success' : 'blue lighten-2'">fa-bullseye</v-icon>
      </v-btn>

      <v-text-field
        hide-details
        prepend-icon="fa-search"
        single-line
      ></v-text-field>

    </v-toolbar>


    <v-expansion-panels multiple
                        v-if="toggleAddPOI"
                        v-model="panel"
                        class="c-border-a elevation-4">
      <v-expansion-panel>
        <v-expansion-panel-header>Submit Request for Agent (RFA)</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form ref="form"
                  v-model="isValid"
          >
            <v-row>
              <v-sheet v-for="(i, k) in formSchema" class="col-lg-3 col-6 pa-2" :key="k">
                <v-text-field outlined dense
                              v-model="formData[k]"
                              :placeholder="i.placeholder"
                              :label="i.label"
                              :readonly="i.readonly"
                              :disabled="!isUserAuthenticated"
                />
              </v-sheet>

              <!-- Date Picker -->
              <v-col cols="12" sm="6" md="4">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="request_date"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field readonly
                                  v-model="request_date"
                                  label="Requested Date"
                                  prepend-icon="fa-calendar"
                                  v-bind="attrs"
                                  v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="request_date" no-title scrollable @input="menu = false">
                    <v-spacer/>
                    <v-btn text color="" @click="menu = false">Cancel</v-btn>
                    <v-btn text color="success" @click="$refs.menu.save(request_date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

            </v-row>

            <v-btn :disabled="!isValid || !isUserAuthenticated" @click="submitPOI()">
              Submit
            </v-btn>

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
      toggleAddPOI: true,
      panel: [0, 1],
      menu: false,
      isValid: true,
      request_date: this.dayjs().format('YYYY-MM-DD'),
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
          type: 'text',
          placeholder: '',
          readonly: true
        },
        // submitter_email: {
        //   label: 'Email',
        //   type: 'text',
        //   placeholder: '',
        //   readonly: true
        // },
        client_name: {
          label: 'Client Name',
          type: 'text'
        },
        client_email: {
          label: 'Client Email',
          type: 'text',
        },
        // date_entered: {
        //   label: 'Date Entered',
        //   type: 'text',
        //   placeholder: this.dayjs().format(),
        //   readonly: true
        // },
        requested_destination: {
          label: 'Destination',
          type: 'text'
        },
        // requested_date: {
        //   label: 'Date Requested',
        //   type: 'picker',
        //   value: this.dayjs().toISOString()
        // },
        requested_time: {
          label: 'Time Requested',
          type: 'text'
        }
      }
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    authenticated_user() {
      return this.$store.state.authenticated_user
    },
    isUserAuthenticated() {
      return this.$store.state.isUserAuthenticated
    }
  },
  watch: {
    isUserAuthenticated(newVal, oldVal) {
      console.log('isUserAuthenticated changed', this.authenticated_user)
      if (newVal) {
        this.formSchema.submitter_name.placeholder = this.authenticated_user.name
        // this.formSchema.submitter_email.placeholder = this.authenticated_user.email
      }
      if (!newVal) {
        this.formSchema.submitter_name.placeholder = 'fake name'
      }
    }
  },
  methods: {
    submitPOI() {
      this.reset()
    },
    reset() {
      this.$refs.form.reset()
    },
  }
}
</script>

<style scoped>
</style>
