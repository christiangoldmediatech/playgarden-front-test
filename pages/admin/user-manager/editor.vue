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
              :to="{ name: 'admin-user-manager' }"
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
                      <v-text-field
                        v-model="user.firstName"
                        :error-messages="errors"
                        label="First Name"
                        solo
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" lg="4" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Last Name"
                      rules="required"
                    >
                      <v-text-field
                        v-model="user.lastName"
                        :error-messages="errors"
                        label="Last Name"
                        solo
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" lg="4" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="E-mail"
                      rules="required|email"
                    >
                      <v-text-field
                        v-model="user.email"
                        :error-messages="errors"
                        label="E-mail"
                        solo
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" lg="4" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Phone Number"
                      rules="required|phone"
                    >
                      <v-text-field
                        v-model="user.phoneNumber"
                        :error-messages="errors"
                        label="Phone Number"
                        solo
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" lg="4" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Role"
                      rules="required"
                    >
                      <v-select
                        v-model="user.roleId"
                        :error-messages="errors"
                        :items="roles"
                        label="Role"
                        solo
                      />
                    </validation-provider>
                  </v-col>

                  <v-col v-if="!id" cols="12" lg="4" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Password"
                      rules="required|min:8|max:20|w_number|w_special|w_upper"
                    >
                      <password-field
                        v-model="user.password"
                        counter
                        :error-messages="errors"
                        hint="At least 8 characters"
                        label="Password"
                        solo
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
  name: 'Editor',

  layout: 'admin',

  data () {
    return {
      loading: false,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        roleId: null,
        password: null
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
      return this.id ? 'Edit User' : 'New User'
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
      promises.push(this.getUserById(this.id))
    }

    const results = await Promise.all(promises)

    if (results[1]) {
      const data = results[1]
      this.user.firstName = data.firstName
      this.user.lastName = data.lastName
      this.user.email = data.email
      this.user.phoneNumber = data.phoneNumber
      this.user.roleId = data.role.id
    }

    this.loading = false
  },

  methods: {
    ...mapActions('admin/users', {
      getUsers: 'get',
      getUserById: 'getById',
      createUser: 'create',
      updateUser: 'update'
    }),

    ...mapActions('admin/roles', {
      getRoles: 'get'
    }),

    async save () {
      this.loading = true
      try {
        if (this.id === null) {
          await this.createUser(this.user)
        } else {
          this.user.password = undefined
          await this.updateUser({ id: this.id, data: this.user })
        }
      } catch (err) {
        this.loading = false
        return
      } finally {
        this.$router.push({ name: 'admin-users' })
      }
    }
  }
}
</script>
