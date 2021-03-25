<template>
  <v-row v-if="initialized" justify="center" no-gutters>
    <v-col cols="12">
      <validation-observer v-slot="{ invalid, passes }">
        <v-form @submit.prevent="passes(onSubmit)">
          <!-- Plan -->
          <v-row justify="center">
            <div>
              <p
                class="font-weight-bold mb-6 text-center text-h5 text-md-left"
              >
                {{ updating ? "UPDATE" : "CHOOSE YOUR" }} PLAN
              </p>

              <p class="product-info px-2">
                *You will not be charged until the end of the 30 DAY TRIAL period and you can cancel anytime.<br>
              </p>

              <p class="plan-announcement px-2">
                <img src="@/assets/svg/confetti.svg" width="24px" height="24px"> Live Enrichment Classes and Playdates included with <span class="highlight">Standard</span> and <span class="highlight">Premium</span> Plans FOR A LIMITED TIME <img class="flip-image" src="@/assets/svg/confetti.svg" width="24px" height="24px">
              </p>
            </div>
          </v-row>

          <v-row
            v-if="$vuetify.breakpoint.mdAndUp"
            class="mx-n3"
            justify="center"
            no-gutters
          >
            <v-col
              v-for="(plan, indexP) in plans"
              :key="indexP"
              :class="`${
                indexP === 1
                  ? 'c-col elevation-3 mx-md-3 card-plan'
                  : 'c-col elevation-3 mx-md-3 pa-3 card-plan mt-10'
              }`"
            >
              <div v-show="indexP === 1" class="text-right">
                <v-chip class="most-popular" label>
                  Most Popular
                </v-chip>
              </div>
              <div>
                <p
                  :class="`${
                    indexP === 1
                      ? 'plan-name text-center mt-0'
                      : 'plan-name text-center mt-10'
                  }`"
                >
                  <v-chip
                    color="orange"
                    class="text-orange-info mb-8 py-4"
                    label
                  >
                    {{ getTypePlan(indexP) }}
                  </v-chip>
                  <br>
                  <underlined-title
                    font-size="30px"
                    :line-from="65"
                    :text="plan.name"
                  />
                </p>

                <p
                  :class="`${
                    indexP === 1
                      ? 'text-center mt-5 plan-included'
                      : 'text-center mt-6 plan-included'
                  }`"
                >
                  <label class="font-weight-bold">What's included</label>
                  <!-- <br>
                      <span
                        v-if="indexP === 1"
                        class="info-prodcut-detail"
                      >Everything in the SILVER Plan,
                        <span class="font-weight-bold">plus extra!</span></span>
                      <span
                        v-if="indexP === 2"
                        class="info-prodcut-detail"
                      >Everything in the GOLD Plan,
                        <span class="font-weight-bold">plus extra!</span></span> -->
                </p>

                <plan-description
                  :plan="plan"
                  :index-plan="indexP"
                  class="ml-8 mr-8"
                />

                <p class="text-center">
                  <span class="product-price">
                    ${{ (plan.priceAnnual / 12).toFixed(2) }}
                  </span>
                  <span class="product-month">/Month</span>
                  <br>
                  <span
                    v-if="indexP === 0"
                    class="info-prodcut-detail"
                  >Billed Annually (Save ~$170)</span>
                  <span
                    v-if="indexP === 1"
                    class="info-prodcut-detail"
                  >Billed Annually (Save ~$300)</span>
                  <span
                    v-if="indexP === 2"
                    class="info-prodcut-detail"
                  >Billed Annually (Save ~$1,200)</span>
                </p>
              </div>

              <div v-if="indexP === 2" class="mb-6">
                <div class="enroll-text">
                  Call us to enroll
                </div>
                <div class="limited-text">
                  Limited Availability
                </div>
              </div>
              <validation-provider v-else v-slot="{ errors }" name="Plan" rules="required">
                <v-radio-group
                  v-model="radioGroup"
                  class="ma-0 pa-0"
                  :disabled="loading"
                  :error-messages="errors"
                  :loading="loading"
                >
                  <radio-selectors
                    v-model="draft"
                    :plan="plan"
                    :index-plan="indexP"
                    :class="`${indexP === 1 ? 'mb-9 px-6' : 'mb-6 px-6'}`"
                  />
                </v-radio-group>
              </validation-provider>
            </v-col>
          </v-row>

          <v-row v-else no-gutters>
            <v-col
              v-for="(plan, indexP) in plans"
              :key="indexP"
              class="my-3"
              cols="12"
            >
              <v-expansion-panels :value="0">
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <div class="text-center">
                      <v-chip
                        color="orange"
                        class="text-orange-info mb-3 py-4"
                        label
                      >
                        {{ getTypePlan(indexP) }}
                      </v-chip>

                      <br>

                      <underlined-title
                        font-size="18px"
                        :line-from="65"
                        :text="plan.name"
                      />
                    </div>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content class="pa-0 ma-0">
                    <plan-description :plan="plan" :index-plan="indexP" />
                  </v-expansion-panel-content>
                  <div v-if="indexP === 2" class="mb-6">
                    <div class="enroll-text">
                      Call us to enroll
                    </div>
                    <div class="limited-text">
                      Limited Availability
                    </div>
                  </div>
                  <validation-provider v-else v-slot="{ errors }" name="Plan" rules="required">
                    <v-radio-group
                      v-model="radioGroup"
                      class="ma-0 pa-0"
                      :disabled="loading"
                      :error-messages="errors"
                      :loading="loading"
                    >
                      <radio-selectors
                        v-model="draft"
                        class="mb-6 px-6"
                        :plan="plan"
                        :index-plan="indexP"
                      />
                    </v-radio-group>
                  </validation-provider>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>

          <v-row
            v-if="!noAddress"
            class="shipping flex-md-row mt-8"
            justify="center"
            no-gutters
          >
            <v-col class="px-md-6">
              <p class="text-center text-md-justify">
                <span
                  class="font-weight-bold text-h5 pg-letter-spacing text-center text-md-justify"
                >
                  SHIPPING ADDRESS
                </span>
                <br>
                <span class="text-h8">
                  For our PREMIUM and PREMIUM PLUS plans, we require a shipping address in order to send the Welcome Kit with Backpack, workbooks, and additional materials so you can easily receive them at the comfort of your home.
                </span>
              </p>

              <!-- Street 1 -->
              <validation-provider
                v-slot="{ errors }"
                name="Street 1"
                rules="required"
              >
                <pg-text-field
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
              <pg-text-field
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
                <pg-text-field
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
                    <pg-text-field
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
                    <pg-text-field
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

          <v-row justify="center" no-gutters>
            <v-col cols="12" sm="6">
              <v-btn
                block
                color="warning"
                class="my-6 main-btn"
                :disabled="invalid"
                :loading="loading"
                type="submit"
                x-large
              >
                {{ noPayment ? "SAVE" : "NEXT" }}
              </v-btn>

              <v-btn
                v-if="updating"
                block
                class="mb-6 main-btn"
                color="primary"
                :disabled="invalid"
                :loading="loading"
                text
                x-large
                @click="$emit('click:cancel')"
              >
                CLOSE
              </v-btn>
            </v-col>
          </v-row>.
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
    userLoadPlan: {
      type: Number,
      default: undefined
    },

    inSignUpProcess: Boolean,

    noAddress: Boolean,

    noPayment: Boolean,

    administrator: Boolean,

    updating: Boolean
  },

  data: () => ({
    draftAddress: {},
    plans: [],
    productPrice: 324,
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

    if (this.loadPlan) {
      console.log('readPlan --', this.loadPlan)
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
      'getSelectedSubscriptionPlanByUser',
      'fetchSubscriptionPlan',
      'selectSubscriptionPlan'
    ]),

    getTypePlan (index) {
      let plan = ''
      switch (index) {
        case 0:
          plan = 'STANDARD'
          break
        case 1:
          plan = 'PREMIUM'
          break
        case 2:
          plan = 'PREMIUM PLUS'
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
        const plan = (this.userLoadPlan) ? await this.getSelectedSubscriptionPlanByUser(this.userLoadPlan) : await this.getSelectedSubscriptionPlan()
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

    onSubmit () {
      if (this.administrator) {
        this.$emit('click:administrator', {
          planSelected: this.getSubmittableData()
        })
      } else {
        this.dataSubmitDialog()
      }
    },

    async dataSubmitDialog () {
      this.loading = true

      try {
        if (!this.noAddress) {
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
  background-color: var(--v-accent-base) !important;
  color: var(--v-white-base) !important;
  height: 19px;
  font-size: 18px;
}

.text-orange-info::v-deep.v-chip .v-chip__content {
  color: var(--v-white-base) !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 3.15px;
  line-height: 1.48;
  background-color: var(--v-accent-base) !important;
}

.product-info {
  font-size: 11px !important;
}

.card-plan {
  max-width: 350px;
  @media screen and (min-width: 1264px) {
    max-width: 426px;
  }
  @media screen and (min-width: 1904px) {
    max-width: 526px;
  }
}

.text-orange-info::v-deep.v-chip--label {
  border-radius: 0px !important;
}
.most-popular::v-deep.v-chip .v-chip__content {
  color: #ff8000 !important;
  font-weight: bold;
}
.most-popular::v-deep.v-chip--label {
  font-weight: bold;
  color: var(--v-white-base) !important;
  border-radius: 0px !important;
  background: rgba(255, 163, 72, 0.35);
}
.product-price {
  font-size: 38px !important;
  color: var(--v-black-base) !important;
  font-weight: bold;
}
.info-prodcut-detail {
  font-size: 11px;
}
.product-month {
  font-weight: bold;
  font-size: 28px !important;
}
.plan-name {
  min-height: 125px;
}
.plan-included {
  min-height: 25px;
}
// .update-plan-margin {
//   margin-left: 8%;
// }
.plan-announcement {
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0px;
  text-align: center;
  .highlight {
    color: var(--v-accent-base);
    font-weight: 600;
  }
  .flip-image {
    transform: scaleX(-1);
  }
}
.shipping {
  max-width: 830px;
  margin: 0 auto;
}
.enroll-text {
  font-size: 24px;
  line-height: 1.5;
  font-weight: 700;
  text-align: center;
  color: var(--v-accent-base);
  @media screen and (min-width: 960px) {
    font-size: 40px;
  }
}
.limited-text {
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  text-align: center;
  @media screen and (min-width: 960px) {
    font-size: 24px;
  }
}
</style>
