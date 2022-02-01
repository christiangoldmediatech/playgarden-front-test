<template>
  <v-row v-if="initialized" justify="center" no-gutters>
    <v-col cols="12">
      <validation-observer v-slot="{ invalid, passes }">
        <v-form @submit.prevent="passes(onSubmit)">
          <!-- Green Background Ribbon -->
          <div class="d-md-block d-none primary py-16 mx-n3" />
          <!-- Desktop Plan Selection -->
          <v-row
            class="mx-n3"
            justify="center"
            align="start"
            no-gutters
            :style="plansStyle"
          >
            <!-- Contact Us Text -->
            <v-col
              cols="12"
              class="mx-0 mx-md-4 mb-8 my-md-8 text-center text-h6 font-weight-bold"
              order="0"
              order-md="4"
            >
              <span class="grey--text">Need help? </span>
              <span class="text-decoration-underline" @click="showContactUsModal">
                <a class="accent--text">Contact us</a>
              </span>
            </v-col>
            <!-- Plan Card -->
            <v-col
              v-for="(plan, indexP) in plans"
              :key="indexP"
              :class="planCardClasses(indexP)"
              :order="indexP + 1"
            >
              <!-- Most Popular Chip -->
              <div v-show="indexP === 1" class="text-right">
                <v-chip class="most-popular" label>
                  Most Popular
                </v-chip>
              </div>
              <div class="px-4 px-md-8">
                <!-- Plan Name -->
                <p :class="planNameClasses(indexP)">
                  <underlined-title
                    font-size="32px"
                    font-size-mobile="28px"
                    :line-from="45"
                    :text="plan.name"
                  />
                </p>
                <!-- What's Included -->
                <p class="text-left plan-included">
                  <label class="grey--text text--darken-2 font-weight-bold">What's included</label>
                </p>

                <plan-description
                  :plan="plan"
                  :index-plan="indexP"
                  show-promotions
                />
                <!-- Price -->
                <p class="text-center mt-8">
                  <span
                    v-if="isAnnualSubscriptionEnabled"
                    class="product-price"
                  >
                    ${{ (plan.priceAnnual / 12).toFixed(2) }}
                  </span>
                  <span
                    v-else
                    class="product-price"
                  >
                    ${{ (plan.priceMonthly).toFixed(2) }}
                  </span>

                  <span class="product-month">/Month</span>
                  <br>
                  <template v-if="isAnnualSubscriptionEnabled">
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
                  </template>
                </p>
              </div>
              <!-- Call Us To Enroll Text -->
              <div v-if="indexP === 2" class="mb-6">
                <div class="enroll-text">
                  Call us to enroll
                </div>
                <div class="limited-text">
                  Limited Availability
                </div>
              </div>

              <template v-else>
                <!-- Radio Button Selection -->
                <div
                  v-if="isAnnualSubscriptionEnabled"
                  class="d-flex justify-center"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    name="Plan"
                    rules="required"
                  >
                    <v-radio-group
                      v-model="radioGroup"
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
                </div>
                <!-- Choose Plan Button -->
                <div class="d-flex justify-center mb-8">
                  <v-btn
                    large
                    class="text-none"
                    color="accent"
                    width="250px"
                    :disabled="invalid"
                    type="submit"
                    @click="selectedPlan = plan"
                  >
                    Choose Plan
                  </v-btn>
                </div>
              </template>
              <div v-if="planHasPromotions(plan)" class="text-center px-2 mb-12">
                <span class="body-2 accent--text font-weight-bold">
                  *Activities unlocked for current promotion period, normally available for Homeschool Plan only
                </span>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </validation-observer>
    </v-col>
  </v-row>

  <pg-loading v-else />
</template>

<script>
import { defineComponent, useStore, computed } from '@nuxtjs/composition-api'
import { get } from 'lodash'
import { mapActions, mapGetters } from 'vuex'

import submittable from '@/utils/mixins/submittable'

import { useGlobalModal } from '@/composables'

import PlanDescription from './PlanDescription.vue'
import RadioSelectors from './RadioSelectors.vue'

export default defineComponent({
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

  setup () {
    const store = useStore()
    const { showContactUsModal } = useGlobalModal({ store })
    const isAnnualSubscriptionEnabled = computed(() => store.state.plans.isAnnualSubscriptionEnabled)

    return {
      showContactUsModal,
      isAnnualSubscriptionEnabled
    }
  },

  data: () => ({
    draftAddress: {},
    plans: [],
    selectedPlan: null,
    productPrice: 324,
    loading: false,
    initialized: false,
    radioGroup: null,
    bkgColor: '#BDDA9F'
  }),

  computed: {
    ...mapGetters('auth', ['isUserLoggedIn']),

    isMobile () {
      return this.$vuetify.breakpoint.mobile
    },

    plansStyle () {
      return {
        'margin-top': this.isMobile ? '0px' : '-90px !important'
      }
    }
  },

  async created () {
    await this.fetchPlans()

    this.initialized = true
    this.$emit('initialized')

    if (this.isUserLoggedIn) {
      await this.getPlan()
    }
  },

  methods: {
    ...mapActions(['disableAxiosGlobal', 'enableAxiosGlobal']),

    ...mapActions('payment', [
      'getSelectedSubscriptionPlan',
      'getSelectedSubscriptionPlanByUser',
      'fetchSubscriptionPlan',
      'selectSubscriptionPlan'
    ]),

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
        const plan = this.getSubmittableData()
        plan.id = this.selectedPlan.id
        this.$emit('click:administrator', {
          planSelected: plan
        })
      } else {
        this.dataSubmitDialog()
      }
    },

    async dataSubmitDialog () {
      this.loading = true
      const plan = this.getSubmittableData()
      plan.id = this.selectedPlan.id
      try {
        await this.selectSubscriptionPlan(plan)
        this.$snotify.success('Payment plan has been selected successfully!')
        this.$nuxt.$emit('plan-membership-changed')
        this.$emit('click:submit', {
          draft: plan,
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
    },

    planCardClasses (index) {
      return {
        'c-col mx-md-3 card-plan white': true,
        'mt-md-10': index !== 1,
        'mx-2 my-4': this.isMobile
      }
    },

    planNameClasses (index) {
      return {
        'plan-name text-center': true,
        'mt-11': index !== 1,
        'mt-13': index === 1
      }
    },

    planHasPromotions (plan) {
      return (
        plan &&
        plan.homeDeliveryBenefits &&
        Array.isArray(plan.homeDeliveryBenefits.promotions) &&
        plan.homeDeliveryBenefits.promotions.length > 0
      )
    }
  }
})
</script>

<style lang="scss" scoped>
.c-col {
  align-content: space-between;
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
  box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.27) !important;
  border-radius: 5px !important;
  max-width: 350px;
  @media screen and (min-width: 1264px) {
    max-width: 426px;
  }
  @media screen and (min-width: 1904px) {
    max-width: 526px;
  }
}

.text-orange-info::v-deep.v-chip--label {
  border-radius: 3px !important;
}
.most-popular::v-deep.v-chip .v-chip__content {
  color: #ff8000 !important;
  font-weight: bold;
}
.most-popular::v-deep.v-chip--label {
  font-weight: bold;
  font-size: 16px;
  padding: 15px 30px;
  color: var(--v-white-base) !important;
  border-radius: 0px !important;
  background: rgba(255, 163, 72, 0.35);
}
.product-price {
  font-size: 40px !important;
  color: var(--v-black-base) !important;
  font-weight: bold;
}
.info-prodcut-detail {
  font-size: 12px;
}
.product-month {
  color: var(--v-black-base) !important;
  font-weight: bold;
  font-size: 30px !important;
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
.enroll-text {
  font-size: 24px;
  line-height: 1.5;
  font-weight: 700;
  text-align: center;
  color: var(--v-accent-base);
  @media screen and (min-width: 960px) {
    font-size: 32px;
  }
}
.limited-text {
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  text-align: center;
  @media screen and (min-width: 960px) {
    font-size: 20px;
  }
}
.v-btn:not(.v-btn--text) {
  font-size: 18px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
}
</style>
