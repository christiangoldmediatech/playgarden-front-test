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
              @click.stop="getBack"
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
                  <b class="pt-9 mr-2">Is active ?</b>
                  <v-switch v-model="user.testUser" :label="getActive" class="mr-4" />
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
                      name="Plan"
                      rules="required"
                    >
                      <pg-select
                        v-model="user.planId"
                        :error-messages="errors"
                        :items="planList"
                        label="Plan"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Promotion Code"
                    >
                      <pg-text-field
                        v-model="user.promotionCode"
                        :error-messages="errors"
                        label="Promotion Code"
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

<script lang="ts">

import { defineComponent, computed, onMounted } from '@nuxtjs/composition-api'
import { usePlans } from '@/composables/users'
import { Plan } from '@/models'

export default defineComponent({
  name: 'ParentEditForm',

  data () {
    return {
      loading: false,
      id: null,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        promotionCode: '',
        roleId: null,
        planId: null,
        testUser: null,
        password: null,
        workbookSent: false,
        backpackSent: false
      }
    }
  },

  setup () {
    computed(async () => await getPlans())
    const { plans, getPlans, saveUser } = usePlans()

    onMounted(async () => {
      await getPlans()
    })

    return {
      plans,
      saveUser
    }
  },

  computed: {
    title () {
      return this.id ? 'Edit Parent' : 'New Parent'
    },

    getActive () {
      return (this.user.testUser) ? 'Yes' : 'No'
    },

    planList () {
      const list = this.plans.map((plan: Plan) => {
        return { text: plan.planName, value: plan.id }
      })
      return list
    }
  },
  methods: {
    getBack () {
      this.$router.go(-1)
    },

    async save () {
      console.log('aqui', this.user)
      await this.saveUser({ data: this.user })
      this.getBack()
    }
  }
})
</script>
