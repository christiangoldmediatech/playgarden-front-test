<template>
  <v-row v-if="initialized">
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
                <span class="font-weight-bold text-h5">
                  CHOOSE YOUR PLAN
                </span>
              </p>

              <v-row>
                <v-col
                  v-for="(plan, indexP) in plans"
                  :key="indexP"
                  class="c-col elevation-3 mx-md-3 my-3"
                  cols="12"
                  md=""
                >
                  <div>
                    <p class="text-center">
                      <underlined-title
                        font-size="20px"
                        :line-from="65"
                        :text="plan.name"
                      />
                    </p>

                    <ul>
                      <li
                        v-for="(benefit, indexPCB) in plan.commonBenefits
                          .benefits"
                        :key="indexPCB"
                      >
                        {{ benefit }}
                      </li>
                    </ul>

                    <template v-if="plan.homeDeliveryBenefits">
                      <section class="font-weight-bold mt-6">
                        Home Delivery of:
                      </section>

                      <ul>
                        <li
                          v-for="(benefit, indexHDB) in plan
                            .homeDeliveryBenefits.benefits"
                          :key="indexHDB"
                        >
                          {{ benefit }}
                        </li>
                      </ul>
                    </template>

                    <template v-if="plan.plusBenefits">
                      <section class="font-weight-bold mt-6">
                        Plus:
                      </section>

                      <ul>
                        <li
                          v-for="(benefit, indexPB) in plan.plusBenefits
                            .benefits"
                          :key="indexPB"
                        >
                          {{ benefit }}
                        </li>
                      </ul>
                    </template>
                  </div>

                  <div>
                    <v-divider class="my-3" />

                    <v-radio
                      :label="`$${plan.priceMonthly} a month/child`"
                      :value="plan.monthlyStripeId"
                      class="plan-pricing"
                      @change="
                        draft = {
                          id: plan.id,
                          type: 'monthly',
                          requireAddress: Boolean(
                            plan.homeDeliveryBenefits || plan.plusBenefits
                          )
                        }
                      "
                    />

                    <v-radio
                      class="mb-0 plan-pricing"
                      :label="`$${plan.priceAnnual} School Year Special/child`"
                      :value="plan.anualStripeId"
                      @change="
                        draft = {
                          id: plan.id,
                          type: 'annual',
                          requireAddress: Boolean(
                            plan.homeDeliveryBenefits || plan.plusBenefits
                          )
                        }
                      "
                    />

                    <small class="ml-8">(10 months)</small>
                  </div>
                </v-col>
              </v-row>
            </v-radio-group>
          </validation-provider>

          <v-row v-if="!noAddress && draft.requireAddress">
            <v-col>
              <p>
                <span class="font-weight-bold text-h5">
                  Shipping address
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

              <v-row>
                <v-col cols="6">
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

                <v-col cols="6">
                  <!-- Zipcode -->
                  <validation-provider
                    v-slot="{ errors }"
                    name="Zipcode"
                    rules="required"
                  >
                    <v-text-field
                      v-model="draftAddress.zipCode"
                      clearable
                      :disabled="loading"
                      :error-messages="errors"
                      :loading="loading"
                      placeholder="Zipcode"
                      solo
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-btn
            block
            class="mb-6"
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
import { mapActions, mapGetters, mapMutations } from 'vuex'

import submittable from '@/utils/mixins/submittable'

export default {
  name: 'SubscriptionPlanSelection',

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
      await this.getBillingDetails()
    }
  },

  methods: {
    ...mapActions('shipping-address', ['createShippingAddress']),

    ...mapActions('payment', [
      'fetchBillingDetails',
      'fetchSubscriptionPlan',
      'selectSubscriptionPlan'
    ]),

    ...mapMutations({
      disableAxiosGlobal: 'DISABLE_AXIOS_GLOBAL_ERROR_HANDLER',
      enableAxiosGlobal: 'ENABLE_AXIOS_GLOBAL_ERROR_HANDLER'
    }),

    async getBillingDetails () {
      try {
        this.disableAxiosGlobal()
        const data = await this.fetchBillingDetails()

        this.radioGroup = get(data, 'subscriptionData.plan.id')

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
          await this.createShippingAddress(this.draftAddress)
        }

        await this.selectSubscriptionPlan(this.getSubmittableData())

        this.$snotify.success('Payment plan has been selected successfully!')

        this.$emit('click:submit', {
          draft: this.getSubmittableData(),
          draftAddress: this.draftAddress
        })
      } catch (e) {
      } finally {
        this.loading = false
      }
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

ul {
  list-style: none; /* Remove default bullets */
}

ul li::before {
  content: "✔";
  color: var(--v-primary-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 1em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
}

.plan-pricing ::v-deep .v-label {
  color: $pg-black;
  opacity: 2.49 !important;
}

.v-item--active ::v-deep .v-label {
  font-weight: bold !important;
}
</style>
