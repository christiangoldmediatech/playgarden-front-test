<template>
  <v-row no-gutters>
    <!-- Desktop Title -->
    <v-col cols="12" class="d-none d-md-block">
      <div class="text-uppercase font-weight-bold text-h4 grey--text text--darken-2 pb-12">
        Membership
      </div>
    </v-col>

    <!-- Membership Billing Information -->
    <v-col cols="12" md="6" class="pr-md-8 mb-12 mb-md-0">
      <v-card class="pa-4 px-md-10 py-md-6 card-custom-border">
        <!-- Desktop SVG -->
        <div class="justify-center pb-8 d-none d-md-flex">
          <img
            height="154px"
            src="@/assets/svg/membership.svg"
          >
        </div>

        <!-- Mobile SVG and Title= -->
        <div class="d-flex d-md-none justify-center py-4">
          <img
            height="44px"
            src="@/assets/svg/membership.svg"
          >
          <span class="text-uppercase font-weight-bold text-h5 grey--text text--darken-2 mt-1 ml-2">
            Membership
          </span>
        </div>

        <div class="text-center body-1 font-weight-medium grey--text text--darken-2 mt-2 mb-8">
          Here is a brief description about membership
        </div>

        <div v-if="hasMembership">
          <!-- Trial Period Description -->
          <v-row v-if="billing.status === 'trialing'" no-gutters>
            <v-col cols="12" class="text-h6 text-md-h5 grey--text mb-3">
              Free trial period ends
            </v-col>

            <v-col cols="12" class="text-h6 text-md-h5 grey--text font-weight-bold mb-3">
              {{ billing.trialEndDate }}
            </v-col>
          </v-row>

          <!-- Next Billing Date -->
          <v-row v-else no-gutters class="mb-3">
            <v-col cols="12" class="text-h6 text-md-h5 grey--text mb-3">
              Your next billing date is
            </v-col>

            <v-col cols="12" class="text-h6 text-md-h5 grey--text font-weight-bold mb-3">
              {{ billing.nextBillingDate }}
            </v-col>
          </v-row>

          <!-- Monthly Membership Fee -->
          <v-row no-gutters class="mb-3">
            <v-col cols="12" class="text-h6 text-md-h5 grey--text mb-3">
              Your {{ membershipInterval }} membership fee is
            </v-col>

            <v-col cols="12" class="text-h6 text-md-h5 grey--text font-weight-bold mb-3">
              <div>
                <span>{{
                  billing.planAmount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }}</span>
              </div>
            </v-col>
          </v-row>

          <!-- Discount -->
          <v-row v-if="billing.planAmountDiscount" no-gutters>
            <v-col cols="12" class="text-h6 text-md-h5 grey--text mb-3">
              Discount
            </v-col>

            <v-col cols="12" class="text-h6 text-md-h5 grey--text font-weight-bold mb-3">
              <span v-if="billing.percentOff">
                {{ billing.percentOff }} %
              </span>
              <span v-if="billing.amountOff">
                {{
                  billing.amountOff.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }}
              </span>
            </v-col>
          </v-row>

          <v-divider v-if="billing.planAmountDiscount" />

          <!-- Total Amount -->
          <v-row v-if="billing.planAmountDiscount" no-gutters class="mt-3">
            <v-col cols="6" class="text-h5 text-md-h4 grey--text">
              Total
            </v-col>

            <v-col cols="6" class="text-h5 text-md-h4 grey--text font-weight-bold text-right">
              <span v-if="billing.planAmountDiscount">{{
                billing.planAmountDiscount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })
              }}</span>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-col>

    <!-- Plan Information -->
    <v-col cols="12" md="6" class="pl-md-8 mb-12 mb-md-0">
      <v-row no-gutters>
        <v-col cols="12" class="mb-12">
          <v-card class="pa-4 px-md-10 py-md-6 card-custom-border">
            <v-row no-gutters>
              <!-- Plan Name-->
              <v-col cols="12" class="text-center">
                <div class="text-uppercase font-weight-bold text-h5 grey--text text--darken-2 mb-6">
                  Your Plan
                </div>

                <v-btn class="warning mb-8" depressed width="160px">
                  {{ billing.planName }}
                </v-btn>
              </v-col>

              <!-- Plan Name -->
              <v-col cols="12" class="mb-4 text-center">
                <underlined-title :text="plan.name" font-size="32px" />
              </v-col>

              <!-- Plan Description -->
              <v-col cols="12" class="mb-10 mx-0 mx-lg-12">
                <plan-description
                  v-if="Object.keys(plan).length"
                  :plan="plan"
                  :index-plan="plan.id - 1"
                />
              </v-col>

              <!-- Change Plan Button -->
              <v-col cols="12" class="d-flex justify-center">
                <v-btn
                  color="primary mb-3"
                  x-large
                  block
                  @click="changePlanModal = true"
                >
                  CHANGE PLAN
                </v-btn>
              </v-col>

              <v-col cols="12" class="d-flex justify-center">
                <!-- Cancel Subscription -->
                <v-btn
                  v-if="hasMembership"
                  block
                  color="error"
                  x-large
                  @click="removeSubscriptionModal = true"
                >
                  CANCEL MEMBERSHIP
                </v-btn>
                <!-- Create Subscription -->
                <v-btn
                  v-else
                  block
                  color="primary"
                  x-large
                  @click="selectPlan"
                >
                  CREATE MEMBERSHIP
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- Payment Method -->
        <v-col cols="12">
          <v-card class="pa-4 px-md-10 py-md-6 card-custom-border">
            <v-row no-gutters class="text-uppercase font-weight-bold text-h5 grey--text text--darken-2" justify="center">
              Payment Method
            </v-row>
            <v-row
              v-for="(card, indexUC) in userCards"
              :key="indexUC"
              align="center"
              no-gutters
            >
              <v-col cols="4" class="text-center text-h6 grey--text font-weight-bold mt-8">
                {{ card.details.brand }}
              </v-col>
              <v-col cols="8" class="text-center text-h6 grey--text font-weight-bold mt-8">
                •••• •••• •••• {{ card.details.last4 }}
              </v-col>
              <v-col cols="12" class="d-flex justify-center mt-8">
                <v-btn
                  color="primary"
                  text
                  x-large
                  @click="onUpdateCard(card)"
                >
                  Change Payment Method
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <!-- Cancel suscription modal -->
    <v-dialog
      v-model="removeSubscriptionModal"
      content-class="white"
      :fullscreen="isMobile"
      max-width="1000"
    >
      <v-col cols="12">
        <v-row justify="end">
          <v-btn icon @click.stop="removeSubscriptionModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row class="flex-column-reverse flex-md-row">
          <v-col class="px-6" cols="12" md="6">
            <v-col class="text-center" cols="12">
              <span
                class="font-weight-bold pg-letter-spacing text-h5 text-md-h4"
              >
                WE ARE SORRY
                <br>
                TO SEE YOU GO!
              </span>
            </v-col>

            <v-card-text class="text-justify">
              Early child development is super important, and consistency is key
              to ensure early learning!<br>
              <br>
              Are you sure you want to cancel your membership?
            </v-card-text>
          </v-col>

          <v-col class="px-6" cols="12" md="6">
            <div>
              <v-img
                alt="Remove Subscription"
                max-width="100%"
                :src="require('assets/png/remove-subscription.png')"
              />
            </div>
          </v-col>
        </v-row>
      </v-col>

      <v-col class="text-center" cols="12">
        <v-btn
          color="primary"
          :loading="loading"
          x-large
          @click="removeSubscription"
        >
          CONFIRM CANCELATION
        </v-btn>
      </v-col>

      <v-col class="text-center" cols="12">
        <v-btn
          color="accent"
          :loading="loading"
          x-large
          text
          @click.stop="removeSubscriptionModal = false"
        >
          GO BACK
        </v-btn>
      </v-col>
    </v-dialog>

    <v-dialog
      v-model="stripeCardModal"
      content-class="white"
      :fullscreen="isMobile"
      max-width="1000"
      persistent
    >
      <v-col cols="12">
        <v-row class="pr-3" justify="end">
          <v-btn icon @click.stop="stripeCardModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <v-row class="px-6">
          <v-col>
            <update-billing-method
              v-if="stripeCardModal"
              :card-id="cardToUpate.id"
              no-terms
              no-trial
              @update:success="onSuccessUpdateBilling"
              @click:cancel="stripeCardModal = false"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-dialog>

    <!-- Chance Plan modal -->
    <v-dialog
      v-model="changePlanModal"
      content-class="white"
      :fullscreen="isMobile"
      max-width="80%"
      persistent
    >
      <v-col cols="12">
        <v-row class="pr-3" justify="end">
          <v-btn icon @click.stop="closeChangePlanModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <subscription-plan-selection
          v-if="changePlanModal"
          no-address
          no-payment
          updating
          @click:cancel="closeChangePlanModal"
          @click:submit="onSuccessChangePlan"
        />
      </v-col>
    </v-dialog>
  </v-row>
</template>

<script>
import dayjs from 'dayjs'
import { get } from 'lodash'
import { mapActions } from 'vuex'
import UpdateBillingMethod from '@/components/app/payment/UpdateBillingMethod'
import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'
import PlanDescription from '@/components/app/payment/SubscriptionPlanSelection/PlanDescription'

export default {
  name: 'MembershipDetails',
  components: {
    UpdateBillingMethod,
    SubscriptionPlanSelection,
    PlanDescription
  },
  data () {
    return {
      loading: false,
      billing: {
        membershipInterval: 0,
        nextBillingDate: null,
        planAmount: 0,
        planAmountDiscount: null,
        percentOff: null,
        amountOff: null,
        planName: null,
        trialEndDate: null,
        subscriptionId: null,
        status: null
      },
      cardToUpate: null,
      stripeCardModal: false,
      changePlanModal: false,
      removeSubscriptionModal: false,
      userCards: [],
      plan: {}
    }
  },
  computed: {
    hasMembership () {
      const status = this.billing.status
      return (
        !status ||
        (status !== 'incomplete' &&
          status !== 'incomplete_expired' &&
          status !== 'canceled')
      )
    },
    isTrialingStatus () {
      return this.billing.status === 'trialing'
    },
    membershipInterval () {
      switch (this.billing.membershipInterval) {
        case 'month':
          return 'monthly'
        case 'year':
          return 'yearly'
      }
      return null
    },
    isMobile () {
      return this.$vuetify.breakpoint.mdAndDown
    }
  },
  created () {
    this.getBillingDetails()
    this.getBillingCards()
    this.getPlan()
    this.$nuxt.$on('children-changed', this.getBillingDetails)
  },
  mounted () {
    const val = this.$route.params.changeplan
    if (val && Boolean(val)) {
      this.changePlanModal = true
    }
  },
  beforeDestroy () {
    this.$nuxt.$off('children-changed')
  },
  methods: {
    ...mapActions(['disableAxiosGlobal', 'enableAxiosGlobal']),

    ...mapActions('auth', {
      fetchUserInfoIntoStore: 'fetchUserInfo'
    }),
    ...mapActions('payment', [
      'getSelectedSubscriptionPlan',
      'cancelSubscription',
      'fetchBillingCards',
      'fetchBillingDetails',
      'removeBillingCard'
    ]),
    async getBillingDetails () {
      try {
        this.loading = true
        const data = await this.fetchBillingDetails()
        this.billing.subscriptionId = data.subscriptionId
        this.billing.planAmount = data.planAmount || null
        this.billing.planName = data.planName || null
        this.billing.planAmountDiscount = data.planAmountDiscount || null
        this.billing.amountOff = data.amountOff || null
        this.billing.percentOff = data.percentOff || null

        if (data.subscriptionData) {
          this.billing.membershipInterval = get(
            data,
            'subscriptionData.plan.interval',
            null
          )
          this.billing.status = get(data, 'subscriptionData.status', null)
          this.billing.trialEndDate = get(
            data,
            'subscriptionData.trial_end',
            null
          )
          this.billing.trialEndDate = this.billing.trialEndDate
            ? dayjs(this.billing.trialEndDate * 1000).format('MMMM D, YYYY')
            : null
          this.billing.nextBillingDate = dayjs(
            data.subscriptionData.current_period_end * 1000
          ).format('MMMM D, YYYY')
        }
      } finally {
        this.loading = false
      }
    },
    async getBillingCards () {
      try {
        this.loading = true
        this.userCards = await this.fetchBillingCards()
      } finally {
        this.loading = false
      }
    },
    onUpdateCard (card) {
      this.stripeCardModal = true
      this.cardToUpate = card
    },
    async removeSubscription () {
      try {
        this.loading = true
        await this.cancelSubscription()
        this.$snotify.success('Subscription has been canceled successfully!')
        await this.getBillingDetails()
        // update auser info on store
        await this.fetchUserInfoIntoStore()
        this.removeSubscriptionModal = false
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    onSuccessUpdateBilling () {
      this.stripeCardModal = false
      this.getBillingCards()
      this.getBillingDetails()
    },
    onSuccessChangePlan () {
      this.getBillingDetails()
      this.closeChangePlanModal()
    },
    closeChangePlanModal () {
      this.changePlanModal = false
      if (this.$route.params.planRedirect) {
        this.$router.push({ name: this.$route.params.planRedirect })
      }
    },
    selectPlan () {
      this.$router.push({
        name: 'app-payment-plan',
        query: { process: 'signup', step: '3' }
      })
    },
    async getPlan () {
      try {
        this.disableAxiosGlobal()
        const response = await this.getSelectedSubscriptionPlan()
        this.plan = response.plan
      } catch (e) {
      } finally {
        this.enableAxiosGlobal()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-custom-border {
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
}

.v-btn:not(.v-btn--text) {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
}
</style>
