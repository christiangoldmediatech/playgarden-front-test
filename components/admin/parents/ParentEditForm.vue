<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            New Parent
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
                        v-model="user.promotion_code"
                        :error-messages="errors"
                        label="Promotion Code"
                        solo-labeled
                        @blur="validateCoupon"
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

import { defineComponent, computed, onMounted, ref, useRouter } from '@nuxtjs/composition-api'
import { usePlans } from '@/composables/users'
import { useSnotifyHelper } from '@/composables'
import { Plan, User } from '@/models'

export default defineComponent({
  name: 'ParentEditForm',

  setup () {
    const loading = ref(false)
    const router = useRouter()
    const snotify = useSnotifyHelper()
    const user = ref<Partial<User>>({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      status: 1,
      promotion_code: '',
      promotion_id: ''
    })

    const { plans, coupons, getPlans, getCoupons, saveUser } = usePlans()
    computed(async () => await getPlans())
    const planList = computed(() => {
      let list: any = []
      if (plans.value.length > 0) {
        list = plans.value.map((plan: Plan) => {
          return { text: plan.planName, value: plan.id }
        })
      }
      return list
    })

    const validateCoupon = async () => {
      if (user.value) {
        loading.value = true
        await getCoupons({ active: true, code: user.value.promotion_code })
        if (coupons.value.length > 0) {
          user.value.promotion_id = coupons.value[0].promotion_id
          snotify.success('Coupon is valid.')
        } else {
          snotify.warning('Coupon is not valid.')
          user.value.promotion_code = ''
          user.value.promotion_id = ''
          loading.value = false
        }
      }
    }

    const getBack = () => {
      router.go(-1)
    }

    onMounted(async () => {
      await getPlans()
    })

    return {
      loading,
      user,
      plans,
      planList,
      coupons,
      getCoupons,
      saveUser,
      getBack,
      validateCoupon
    }
  },
  methods: {
    async save () {
      this.loading = true
      await this.saveUser({ data: this.user })
      this.loading = false
      this.getBack()
    }
  }
})
</script>
