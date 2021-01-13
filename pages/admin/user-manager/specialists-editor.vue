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
              :to="{ name: 'admin-user-manager-specialists-management' }"
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
                  <v-col cols="12" lg="4" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="First Name"
                      rules="required"
                    >
                      <pg-text-field
                        v-model="specialist.firstName"
                        :error-messages="errors"
                        label="First Name"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" lg="4" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Last Name"
                      rules="required"
                    >
                      <pg-text-field
                        v-model="specialist.lastName"
                        :error-messages="errors"
                        label="Last Name"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" lg="4" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="E-mail"
                      rules="required|email"
                    >
                      <pg-text-field
                        v-model="specialist.email"
                        :error-messages="errors"
                        label="E-mail"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" lg="4" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Phone Number"
                      rules="required|phone"
                    >
                      <pg-text-field
                        v-model="specialist.phoneNumber"
                        v-mask="['(###) ###-####']"
                        :error-messages="errors"
                        label="Phone Number"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" lg="4" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Role"
                      rules="required"
                    >
                      <pg-select
                        v-model="specialist.roleId"
                        :error-messages="errors"
                        :items="roles"
                        label="Role"
                        disabled
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>

                  <v-col v-if="!id" cols="12" lg="4" md="6">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <validation-provider
                          v-slot="{ errors }"
                          name="Password"
                          rules="required|min:8|max:20|w_number|w_special|w_upper"
                        >
                          <pg-password-field
                            v-model="specialist.password"
                            counter
                            :error-messages="errors"
                            hint="At least 8 characters"
                            label="Password"
                            v-bind="attrs"
                            solo-labeled
                            v-on="on"
                          />
                        </validation-provider>
                      </template>
                      <span class="white--text">At least 6 characters—the more characters, the better.</span><br>
                      <span class="white--text">A mixture of both uppercase and lowercase letters.</span><br>
                      <span class="white--text">A mixture of letters and numbers.</span><br>
                      <span class="white--text">Inclusion of at least one special character, e.g., ! @ # ? ]</span><br>
                    </v-tooltip>
                  </v-col>

                  <v-col cols="12" lg="4" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Profile"
                      rules="required"
                    >
                      <pg-textarea
                        v-model="specialist.profile"
                        :error-messages="errors"
                        label="Profile"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" lg="4" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Profession"
                      rules="required"
                    >
                      <pg-textarea
                        v-model="specialist.profession"
                        :error-messages="errors"
                        label="Profession"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn
                class="px-5 text-none"
                color="primary"
                :disabled="invalid || loading"
                :loading="loading"
                x-large
                @click.stop="passes(save)"
              >
                Finalize
              </v-btn>
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
  name: 'SpecialistsEditor',

  layout: 'admin',

  data () {
    return {
      loading: false,
      specialist: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        roleId: null,
        password: null,
        profile: null,
        profession: null
      }
    }
  },

  computed: {
    ...mapGetters('admin/roles', {
      roleRows: 'rows'
    }),

    id () {
      return this.$route.query.id ? parseInt(this.$route.query.id) : null
    },

    title () {
      return this.id ? 'Edit Specialits' : 'New Specialits'
    },

    roles () {
      return this.roleRows.map(role => ({
        text: role.name,
        value: role.id
      }))
    }
  },

  async created () {
    this.loading = true
    const promises = []

    promises.push(this.getRoles())

    if (this.id) {
      promises.push(this.getSpecialistsById(this.id))
    }

    const results = await Promise.all(promises)
    const { value } = this.roles.find(rol => rol.text === 'SPECIALISTS')
    this.specialist.roleId = value

    if (results[1]) {
      const data = results[1]
      this.specialist.firstName = data.user.firstName
      this.specialist.lastName = data.user.lastName
      this.specialist.email = data.user.email
      this.specialist.phoneNumber = data.user.phoneNumber
      this.specialist.roleId = data.user.role.id
      this.specialist.profile = data.profile
      this.specialist.profession = data.profession
    }

    this.loading = false
  },

  methods: {
    ...mapActions('admin/specialists', {
      getSpecialists: 'get',
      getSpecialistsById: 'getById',
      createSpecialists: 'create',
      updateSpecialists: 'update'
    }),

    ...mapActions('admin/roles', {
      getRoles: 'get'
    }),

    async save () {
      this.loading = true
      try {
        if (this.id === null) {
          await this.createSpecialists(this.specialist)
        } else {
          this.specialist.password = undefined
          await this.updateSpecialists({ id: this.id, data: this.specialist })
        }
      } catch (err) {
        this.loading = false
        return
      } finally {
        this.$router.push({ name: 'admin-user-manager-specialists-management' })
      }
    }
  }
}
</script>
