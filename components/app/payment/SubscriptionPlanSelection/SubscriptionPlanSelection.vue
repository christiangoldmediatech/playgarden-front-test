<template>
  <v-row v-if="initialized" no-gutters>
    <v-col>
      <validation-observer v-slot="{ invalid, passes }">
        <v-form @submit.prevent="passes(onSubmit)">
          <!-- Plan -->
          <validation-provider v-slot="{ errors }" name="Plan" rules="required">
            <v-radio-group
              v-model="radioGroup"
              :disabled="loading"
              :error-messages="errors"
              :loading="loading"
            >
              <p>
                <span class="font-weight-bold text-h5 pg-letter-spacing">
                  CHOOSE YOUR PLAN
                </span>
              </p>

              <v-row
                v-if="$vuetify.breakpoint.mdAndUp"
                class="mx-n3"
                no-gutters
              >
                <v-col
                  v-for="(plan, indexP) in plans"
                  :key="indexP"
                  class="c-col elevation-3 mx-md-3 pa-3"
                >
                  <div>
                    <p class="text-center">
                      <v-chip
                        color="orange"
                        class="text-orange-info mb-3"
                        label
                      >
                        {{ getTypePlan(indexP) }}
                      </v-chip>
                      <br />
                      <underlined-title
                        font-size="20px"
                        :line-from="65"
                        :text="plan.name"
                      />
                    </p>

                    <plan-description :plan="plan" />
                  </div>

                  <radio-selectors v-model="draft" :plan="plan" />
                </v-col>
              </v-row>

              <v-row v-else no-gutters>
                <v-col
                  v-for="(plan, indexP) in plans"
                  :key="indexP"
                  class="my-3"
                  cols="12"
                >
                  <v-expansion-panels>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        <div class="text-center">
                          <underlined-title
                            font-size="20px"
                            :line-from="65"
                            :text="plan.name"
                          />
                        </div>
                      </v-expansion-panel-header>

                      <v-expansion-panel-content class="pa-0 ma-0">
                        <plan-description :plan="plan" />
                      </v-expansion-panel-content>

                      <radio-selectors
                        v-model="draft"
                        class="mb-6 px-6"
                        :plan="plan"
                      />
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-radio-group>
          </validation-provider>

          <v-row v-if="!noAddress && draft.requireAddress" no-gutters>
            <v-col>
              <p class="shipping-info">
                <span class="font-weight-bold text-h5 pg-letter-spacing">
                  SHIPPING ADDRESS
                </span>
                <br />
                <span class="text-h8">
                  For our GOLD and PLATINUM plans, we require a shipping address in order to send the Welcome Kit with Backpack, workbooks, and additional materials so you can easily receive them at the comfort of your home.
                </span>
              </p>

              <!-- Street 1 -->
              <validation-provider
                v-slot="{ errors }"
                name="Street 1"
                rules="required"
              >
                <v-text-field
                  v-model="draftAddress.address1"
                  clearable
                  :disabled="loading"
                  :error-messages="errors"
                  :loading="loading"
                  placeholder="Street 1"
                  solo
                />
              </validation-provider>

              <!-- Street 2 -->
              <v-text-field
                v-model="draftAddress.address2"
                clearable
                :disabled="loading"
                :loading="loading"
                placeholder="Street 2 (optional)"
                solo
              />

              <!-- City -->
              <validation-provider
                v-slot="{ errors }"
                name="City"
                rules="required"
              >
                <v-text-field
                  v-model="draftAddress.city"
                  clearable
                  :disabled="loading"
                  :error-messages="errors"
                  :loading="loading"
                  placeholder="City"
                  solo
                />
              </validation-provider>

              <v-row no-gutters>
                <v-col class="pr-3" cols="6">
                  <!-- State -->
                  <validation-provider
                    v-slot="{ errors }"
                    name="State"
                    rules="required"
                  >
                    <v-text-field
                      v-model="draftAddress.state"
                      clearable
                      :disabled="loading"
                      :error-messages="errors"
                      :loading="loading"
                      placeholder="State"
                      solo
                    />
                  </validation-provider>
                </v-col>

                <v-col class="pl-3" cols="6">
                  <!-- Zip code -->
                  <validation-provider
                    v-slot="{ errors }"
                    name="Zip code"
                    rules="required"
                  >
                    <v-text-field
                      v-model="draftAddress.zipCode"
                      clearable
                      :disabled="loading"
                      :error-messages="errors"
                      :loading="loading"
                      placeholder="Zip code"
                      solo
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-btn
            block
            class="mb-6 main-btn"
            min-height="60"
            color="primary"
            :disabled="invalid"
            :loading="loading"
            type="submit"
            x-large
          >
            {{ noPayment ? "SAVE" : "CONTINUE TO PAYMENT" }}
          </v-btn>
        </v-form>
      </validation-observer>
    </v-col>
  </v-row>

  <pg-loading v-else />
</template>

<script>
import { get } from 'lodash'
import { mapActions, mapGetters } from 'vuex'

import submittable from '@/utils/mixins/submittable'

import PlanDescription from './PlanDescription'
import RadioSelectors from './RadioSelectors'

export default {
  name: 'SubscriptionPlanSelection',

  components: {
    PlanDescription,
    RadioSelectors
  },

  mixins: [submittable],

  props: {
    inSignUpProcess: Boolean,

    noAddress: Boolean,

    noPayment: Boolean
  },

  data: () => ({
    draftAddress: {},
    plans: [],
    loading: false,
    initialized: false,
    radioGroup: null
  }),

  computed: mapGetters('auth', ['isUserLoggedIn']),

  async created () {
    await this.fetchPlans()

    this.initialized = true
    this.$emit('initialized')

    if (this.isUserLoggedIn) {
      await this.getPlan()
      await this.fetchAddress()
    }
  },

  methods: {
    ...mapActions(['disableAxiosGlobal', 'enableAxiosGlobal']),

    ...mapActions('shipping-address', [
      'createShippingAddress',
      'getShippingAddress',
      'updateShippingAddress'
    ]),

    ...mapActions('payment', [
      'getSelectedSubscriptionPlan',
      'fetchSubscriptionPlan',
      'selectSubscriptionPlan'
    ]),

    getTypePlan (index) {
      let plan = ''
      switch (index) {
        case 0:
          plan = 'SILVER'
          break
        case 1:
          plan = 'GOLD'
          break
        case 2:
          plan = 'PLATINUM'
          break
      }
      return plan
    },

    async fetchAddress () {
      try {
        this.disableAxiosGlobal()
        this.draftAddress = await this.getShippingAddress()
      } catch (e) {
      } finally {
        this.enableAxiosGlobal()
      }
    },

    async getPlan () {
      try {
        this.disableAxiosGlobal()
        const plan = await this.getSelectedSubscriptionPlan()

        this.radioGroup = get(plan, 'planSelected')

        this.plans.forEach(
          ({
            id,
            anualStripeId,
            monthlyStripeId,
            plusBenefits,
            homeDeliveryBenefits
          }) => {
            if (
              anualStripeId === this.radioGroup ||
              monthlyStripeId === this.radioGroup
            ) {
              this.draft = {
                id,
                type: anualStripeId === this.radioGroup ? 'annual' : 'monthly',
                requireAddress: Boolean(homeDeliveryBenefits || plusBenefits)
              }
            }
          }
        )
      } catch (e) {
      } finally {
        this.enableAxiosGlobal()
      }
    },

    async fetchPlans () {
      try {
        this.plans = await this.fetchSubscriptionPlan()
      } catch (e) {}
    },

    async onSubmit () {
      this.loading = true

      try {
        if (!this.noAddress && this.draft.requireAddress) {
          await this.submitMethodShippingAddress(this.draftAddress)
        }

        await this.selectSubscriptionPlan(this.getSubmittableData())

        this.$snotify.success('Payment plan has been selected successfully!')

        this.$nuxt.$emit('plan-membership-changed')

        this.$emit('click:submit', {
          draft: this.getSubmittableData(),
          draftAddress: this.draftAddress
        })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    submitMethodShippingAddress (data) {
      return this.draftAddress.id
        ? this.updateShippingAddress({ id: this.draftAddress.id, data })
        : this.createShippingAddress(data)
    },

    resetDraft () {
      this.draft = {
        id: null,
        type: null,
        requireAddress: false
      }

      this.draftAddress = {
        address1: null,
        address2: null,
        city: null,
        state: null,
        zipCode: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.c-col {
  align-content: space-between;
  display: grid;
}

.plan-item {
  font-size: 14px;
}

.text-orange-info {
  background-color: $pg-orange !important;
  color: $pg-white !important;
  height: 19px;
  font-size: 18px;
}

.text-orange-info::v-deep.v-chip .v-chip__content {
  color: $pg-white !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 3.15px;
  line-height: 1.48;
  background-color: $pg-orange !important;
}

.text-orange-info::v-deep.v-chip--label {
    border-radius: 0px !important;
}

.shipping-info {
  text-align: justify;
}
</style>
