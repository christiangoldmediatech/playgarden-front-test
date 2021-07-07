<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            {{ title }}

            <v-spacer />

            <v-btn
              v-if="id"
              class="ml-3"
              color="darken-1"
              nuxt
              small
              @click="changePassword = !changePassword"
            >
              <v-icon dense>
                mdi-account-key {{ user }}
              </v-icon>
              {{ getTitlleChange }}
            </v-btn>

            <v-btn
              class="text-none ml-3"
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
                <v-row class="mt-n4" justify="end">
                  <b class="pt-9 mr-2">Is test user ?</b>
                  <v-switch v-model="user.testUser" :label="getTestUser" class="mr-4" />
                </v-row>
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
                      rules="phone"
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

                  <v-col v-if="changePassword || !id" cols="12" md="6">
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

                  <v-col v-if="user.roleId === 3" cols="12" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Plan"
                      rules="required"
                    >
                      <pg-select
                        v-model="user.planId"
                        :error-messages="errors"
                        :items="getPlans"
                        label="Plan"
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
import dayjs from 'dayjs'

import { jsonCopy } from '@/utils/objectTools.js'

export default {
  name: 'Editor',

  layout: 'admin',

  data () {
    return {
      loading: false,
      workbookSentDate: false,
      backpackSentDate: false,
      changePassword: false,
      workbookDate: null,
      backpackDate: null,
      plans: [],
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        roleId: null,
        planId: null,
        testUser: null,
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

    getTestUser () {
      return (this.user.testUser) ? 'Yes' : 'No'
    },

    getTitlleChange () {
      return (this.changePassword) ? 'NO CHANGE PASSWORD' : 'CHANGE PASSWORD'
    },

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

    getPlans () {
      return this.plans.map(plan => ({
        text: plan.name,
        value: plan.id
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

  watch: {
    changePassword (val) {
      if (!val) {
        this.user.password = undefined
      }
    }
  },

  async created () {
    this.loading = true
    const promises = []

    promises.push(this.getRoles())

    if (this.id) {
      promises.push(this.getUserById(this.id))
    }

    this.plans = await this.fetchSubscriptionPlan()

    const results = await Promise.all(promises)

    if (results[1]) {
      const data = results[1]
      this.user.firstName = data.firstName
      this.user.lastName = data.lastName
      this.user.email = data.email
      this.user.phoneNumber = data.phoneNumber
      this.user.testUser = data.testUser
      this.user.roleId = data.role.id
      this.user.planId = (data.planSelected) ? data.planSelected.id : null
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

    ...mapActions('payment', [
      'fetchSubscriptionPlan'
    ]),

    ...mapActions('admin/roles', {
      getRoles: 'get'
    }),

    async save () {
      this.loading = true
      try {
        if (this.id === null) {
          await this.createUser(this.user)
        } else {
          const user = jsonCopy(this.user)
          await this.updateUser({ id: this.id, data: user })
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
