<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            {{ title }}
            <v-spacer />
            <v-btn
              class="text-none"
              color="accent darken-1"
              depressed
              nuxt
              small
              :to="getUrlBack"
            >
              Back
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <validation-observer v-slot="{ invalid, passes }">
            <v-card-text>
              <v-form>
                <v-row>
                  <v-col class="text-md-right" cols="12" sm="3">
                    <span class="subheader">Name:</span>
                  </v-col>

                  <v-col cols="12" sm="9" lg="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="name"
                      rules="required"
                    >
                      <pg-text-field
                        v-model="agenda.name"
                        :error-messages="errors"
                        solo
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="text-md-right" cols="12" sm="3">
                    <span class="subheader">Description:</span>
                  </v-col>

                  <v-col cols="12" sm="9" lg="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="description"
                      rules="required"
                    >
                      <pg-textarea
                        v-model="agenda.description"
                        :error-messages="errors"
                        solo
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="text-md-right" cols="12" sm="3">
                    <span class="subheader">Day:</span>
                  </v-col>

                  <v-col cols="12" sm="9" lg="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Day"
                      rules="required"
                    >
                      <pg-select
                        v-model="agenda.day"
                        :error-messages="errors"
                        placeholder="Select a Day"
                        :items="days"
                        solo
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col class="text-md-right" cols="12" sm="2">
                    <span class="subheader">Spots:</span>
                  </v-col>

                  <v-col cols="12" sm="9" lg="2">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Spots"
                      rules="required"
                    >
                      <pg-text-field
                        v-model="agenda.spots"
                        :error-messages="errors"
                        solo
                      />
                    </validation-provider>
                  </v-col>

                  <v-col class="text-md-right" cols="12" sm="2">
                    <span class="subheader">Duration:</span>
                  </v-col>

                  <v-col cols="12" sm="9" lg="2">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Duration"
                      rules="required"
                    >
                      <pg-text-field
                        v-model="agenda.duration"
                        :error-messages="errors"
                        solo
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col
                    cols="4"
                  >
                    <v-menu
                      ref="menu"
                      v-model="menuStart"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="agenda.start"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <validation-provider
                          v-slot="{ errors }"
                          name="Time start"
                          rules="required"
                        >
                          <pg-text-field
                            v-model="agenda.start"
                            label="Time start"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            :error-messages="errors"
                            v-bind="attrs"
                            solo
                            v-on="on"
                          />
                        </validation-provider>
                      </template>
                      <v-time-picker
                        v-if="menuStart"
                        v-model="agenda.start"
                        format="24hr"
                        full-width
                        @click:minute="$refs.menu.save(agenda.start)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="4"
                  >
                    <v-menu
                      ref="menu2"
                      v-model="menuEnd"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="agenda.end"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <validation-provider
                          v-slot="{ errors }"
                          name="Time start"
                          rules="required"
                        >
                          <pg-text-field
                            v-model="agenda.end"
                            label="Time end"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            :error-messages="errors"
                            v-bind="attrs"
                            solo
                            v-on="on"
                          />
                        </validation-provider>
                      </template>
                      <v-time-picker
                        v-if="menuEnd"
                        v-model="agenda.end"
                        format="24hr"
                        full-width
                        @click:minute="$refs.menu2.save(agenda.end)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                class="px-5 text-none"
                color="primary"
                :disabled="invalid"
                x-large
                @click.stop="passes(save)"
              >
                Save
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </validation-observer>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Editor',

  layout: 'admin',

  data: vm => (
    {
      specialistId: vm.$route.query.specialistId
        ? parseInt(vm.$route.query.specialistId)
        : null,
      loading: true,
      time: null,
      menuStart: false,
      menuEnd: false,
      days: ['MONDAY', 'THUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
      agenda: {
        name: '',
        description: '',
        duration: '',
        day: null,
        start: null,
        end: null,
        spots: null,
        specialistId: null
      }
    }
  ),

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),

    getUrl () {
      const url = {
        name: 'admin-agenda-editor'
      }
      if (this.userInfo.role.name === 'SUPER_ADMINISTRATORS') {
        url.query = { specialistId: this.specialistId }
      }
      return url
    },

    getUrlBack () {
      const url = {
        name: 'admin-agenda'
      }
      if (this.userInfo.role.name === 'SUPER_ADMINISTRATORS') {
        url.query = { specialistId: this.specialistId }
      }
      return url
    },

    id () {
      return this.$route.query.id ? parseInt(this.$route.query.id) : null
    },

    title () {
      return this.id ? 'Edit Agenda' : 'New Agenda'
    },

    activityTypes () {
      return this.types.map(type => ({
        text: type.name,
        value: type.id
      }))
    }
  },

  watch: {},

  async created () {
    const promises = []
    this.loading = true
    this.agenda.specialistId = (this.userInfo.role.name === 'SPECIALISTS') ? this.userInfo.specialists[0].id : this.specialistId
    if (this.id) {
      promises.push(this.getAgendaById(this.id))
    }

    const results = await Promise.all(promises)
    if (results[0]) {
      const data = results[0]
      this.agenda.name = data.name
      this.agenda.description = data.description
      this.agenda.duration = data.duration
      this.agenda.day = data.day
      this.agenda.start = data.start
      this.agenda.end = data.end
      this.agenda.spots = data.spots
      this.agenda.specialistId = data.specialistUser.id
    }
  },

  methods: {
    ...mapActions('agendas', [
      'createAgenda',
      'updateAgenda',
      'getAgendaById'
    ]),

    async save () {
      this.loading = true
      let id = this.id

      try {
        const agenda = this.agenda
        if (id === null) {
          const response = await this.createAgenda(agenda)
          id = response.id
        } else {
          await this.updateAgenda({ id, data: agenda })
        }
      } catch (err) {
        this.loading = false
        return
      } finally {
        this.$router.push(this.getUrl)
      }
    }
  }
}
</script>
