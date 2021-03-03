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
              @click.stop="goBack"
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
                        v-model="user.firstName"
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
                        v-model="user.lastName"
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
                        v-model="user.email"
                        :error-messages="errors"
                        label="E-mail"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Phone Number"
                      rules="required|phone"
                    >
                      <pg-text-field
                        v-model="user.phoneNumber"
                        :error-messages="errors"
                        label="Phone Number"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Role"
                      rules="required"
                    >
                      <pg-select
                        v-model="user.roleId"
                        :error-messages="errors"
                        :items="roles"
                        label="Role"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>

                  <v-col v-if="!id" cols="12" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Password"
                      rules="required|min:8|max:20|w_number|w_special|w_upper"
                    >
                      <pg-password-field
                        v-model="user.password"
                        counter
                        :error-messages="errors"
                        hint="At least 8 characters"
                        label="Password"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12">
                    <v-row>
                      <v-col cols="12" md="6">
                        <validation-provider v-slot="{ errors }" name="Workbook">
                          <pg-select
                            v-model="user.workbookSent"
                            :error-messages="errors"
                            :items="sentOptions"
                            label="Workbook"
                            solo-labeled
                          />
                        </validation-provider>
                      </v-col>

                      <v-col v-if="user.workbookSent" cols="12" md="6">
                        <v-menu
                          v-model="workbookSentDate"
                          :close-on-content-click="false"
                          min-width="290px"
                          offset-y
                          transition="scale-transition"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Workbook Sent Date"
                              rules="required"
                            >
                              <pg-text-field
                                :disabled="loading"
                                :error-message="errors"
                                label="Workbook Sent Date"
                                readonly
                                solo-labeled
                                :value="dataWorkbookDate"
                                v-bind="attrs"
                                v-on="on"
                              />
                            </validation-provider>
                          </template>

                          <v-date-picker v-model="workbookDate" />
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12">
                    <v-row>
                      <v-col cols="12" md="6">
                        <validation-provider v-slot="{ errors }" name="Backpack">
                          <pg-select
                            v-model="user.backpackSent"
                            :error-messages="errors"
                            :items="sentOptions"
                            label="Backpack"
                            solo-labeled
                          />
                        </validation-provider>
                      </v-col>

                      <v-col v-if="user.backpackSent" cols="12" md="6">
                        <v-menu
                          v-model="backpackSentDate"
                          :close-on-content-click="false"
                          min-width="290px"
                          offset-y
                          transition="scale-transition"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Backpack Sent Date"
                              rules="required"
                            >
                              <pg-text-field
                                :disabled="loading"
                                :error-message="errors"
                                label="Backpack Sent Date"
                                readonly
                                solo-labeled
                                :value="dataBackpackDate"
                                v-bind="attrs"
                                v-on="on"
                              />
                            </validation-provider>
                          </template>

                          <v-date-picker v-model="backpackDate" />
                        </v-menu>
                      </v-col>
                    </v-row>
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
import dayjs from 'dayjs'

export default {
  name: 'Editor',

  layout: 'admin',

  data () {
    return {
      loading: false,
      workbookSentDate: false,
      backpackSentDate: false,
      workbookDate: null,
      backpackDate: null,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        roleId: null,
        password: null,
        workbookSent: false,
        backpackSent: false
      },
      sentOptions: [
        {
          text: 'Sent',
          value: true
        },
        {
          text: 'Pending',
          value: false
        }
      ]
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
    },

    dataWorkbookDate () {
      return this.workbookDate
        ? dayjs(this.workbookDate).format('MM/DD/YYYY')
        : null
    },

    dataBackpackDate () {
      return this.backpackDate
        ? dayjs(this.backpackDate).format('MM/DD/YYYY')
        : null
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
      this.user.workbookSent = false
      this.user.backpackSent = false
      this.user.workbookSentDate = null
      this.user.backpackSentDate = null
      if (data.shipments) {
        this.user.workbookSent = data.shipments.workbook
        this.user.backpackSent = data.shipments.backpack
        this.backpackDate = data.shipments.backpackDate
        this.workbookDate = data.shipments.workbookDate
      }
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
          this.user.workbookSentDate = dayjs(this.workbookDate).toISOString()
          this.user.backpackSentDate = dayjs(this.backpackDate).toISOString()
          this.user.password = undefined
          await this.updateUser({ id: this.id, data: this.user })
        }
        this.$router.push({ name: 'admin-user-manager' })
      } catch (err) {
        this.loading = false
      }
    },

    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
