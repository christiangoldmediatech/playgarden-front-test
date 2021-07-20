<template>
  <v-container>
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
                        :items="plansResponse"
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

<script lang="ts">

import { defineComponent, computed, onMounted } from '@nuxtjs/composition-api'
import { usePlans } from '@/composables/users'

export default defineComponent({
  name: 'ParentEditForm',

  data () {
    return {
      loading: false,
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
      }
    }
  },

  setup () {
    computed(async () => await getPlans())
    const { plansResponse, getPlans } = usePlans()

    onMounted(async () => {
      await getPlans()
    })

    return {
      plansResponse
    }
  }
})
</script>
