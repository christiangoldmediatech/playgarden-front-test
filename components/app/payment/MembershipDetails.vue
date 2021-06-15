<template>
  <v-row no-gutters>
    <!-- Desktop Title -->
    <v-col cols="12" class="d-none d-md-block">
      <div class="text-uppercase font-weight-bold text-h4 grey--text text--darken-2 pb-6">
        Membership
      </div>
    </v-col>

    <!-- Membership Billing Information -->
    <v-col cols="12" md="6" class="pr-md-8 mb-6 mb-md-0">
      <v-card class="pa-4 px-md-10 py-md-6 mb-6 card-custom-border">
        <!-- Desktop SVG -->
        <div class="justify-center pb-4 d-none d-md-flex">
          <img
            height="100px"
            src="@/assets/svg/membership.svg"
          >
        </div>

        <!-- Mobile SVG and Title= -->
        <div class="d-flex d-md-none justify-center py-2">
          <img
            height="45px"
            src="@/assets/svg/membership.svg"
          >
          <span class="text-uppercase font-weight-bold text-h5 grey--text text--darken-2 mt-1 ml-2">
            Membership
          </span>
        </div>

        <div class="text-center body-1 text-md-h6 font-weight-medium grey--text text--darken-2 my-2">
          <small>Information about your membership</small>
        </div>

        <div v-if="hasMembership">
          <!-- Trial Period Description -->
          <v-row v-if="billing.status === 'trialing'" no-gutters>
            <v-col cols="12" class="text-h6 grey--text mb-1">
              <small>Free trial period ends</small>
            </v-col>

            <v-col cols="12" class="text-h6 grey--text font-weight-bold mb-1">
              {{ billing.trialEndDate }}
            </v-col>
          </v-row>

          <!-- Next Billing Date -->
          <v-row v-else no-gutters class="mb-3">
            <v-col cols="12" class="text-h6 grey--text mb-1">
              <small>Your next billing date is:</small>
            </v-col>

            <v-col cols="12" class="text-h6 grey--text font-weight-bold mb-1">
              {{ billing.nextBillingDate }}
            </v-col>
          </v-row>

          <!-- Monthly Membership Fee -->
          <v-row no-gutters class="mb-3">
            <v-col cols="12" class="text-h6 grey--text mb-1">
              <small>Your {{ membershipInterval }} membership fee is:</small>
            </v-col>

            <v-col cols="12" class="text-h6 grey--text font-weight-bold mb-1">
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
            <v-col cols="12" class="text-h6 grey--text mb-1">
              <small>Discount</small>
            </v-col>

            <v-col cols="12" md="6">
              <small class="grey--text font-weight-bold">Code:</small>
              <span class="text-h6 grey--text font-weight-bold mb-3 ml-2">{{ billing.discountCode }}</span>
            </v-col>

            <v-col cols="12" md="6" class="mb-3">
              <small class="grey--text font-weight-bold">Amount:</small>
              <span v-if="billing.percentOff" class="text-h6 grey--text font-weight-bold mb-3 ml-2">
                {{ billing.percentOff }} %
              </span>
              <span v-if="billing.amountOff" class="text-h6 grey--text font-weight-bold mb-3 ml-2">
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
      <!-- Payment Method -->
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
          <v-col cols="4" class="text-center text-subtitle-2 text-sm-h6 grey--text font-weight-bold mt-8">
            {{ card.details.brand }}
          </v-col>
          <v-col cols="8" class="text-center text-subtitle-2 text-sm-h6 grey--text font-weight-bold mt-8">
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

    <!-- Plan Information -->
    <v-col cols="12" md="6" class="pl-md-8 mb-6 mb-md-0">
      <!-- TRIAL EXPIRING RIBBON -->
      <trial-is-expiring
        v-if="isTrialExpiringModalVisible"
        :is-fixed-on-top="false"
        :is-compare-plans-button-visible="false"
      />
      <v-card class="pa-4 px-md-10 py-md-6 card-custom-border">
        <v-row no-gutters>
          <!-- Plan Name-->
          <v-col cols="12" class="text-center">
            <div class="text-uppercase font-weight-bold text-h5 grey--text text--darken-2 mb-6">
              Your Plan
            </div>

            <v-btn class="warning mb-8" depressed width="160px">
              {{ plan.planName }}
            </v-btn>
          </v-col>

          <!-- Plan Name -->
          <v-col v-if="plan.name" cols="12" class="mb-4 text-center">
            <underlined-title :text="plan.name" font-size="32px" />
          </v-col>

          <!-- Plan Description -->
          <!-- TODO: The plan-description component expects an index that is not available
               when using the component separately, here we are using the (plan.id - 1) that
               returns an equivalent number, but we should update this component to accept
               maybe an id instead.[ch1440]
          -->
          <v-col cols="12" class="mb-10 mx-0 mx-lg-12">
            <plan-description
              v-if="Object.keys(plan).length"
              :plan="plan"
            />
          </v-col>

          <!-- Change Plan Button -->
          <v-col v-if="billing.stripeStatus !== 'canceled'" cols="12" class="d-flex justify-center">
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

    <!-- Cancel suscription modal -->
    <pg-dialog
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
              <p>
                Early education and stimulation to
                generate development is key in the first 3 years of a child's life.
              </p>
              <p>
                Playgarden Prep Online was created to help with that. Won't
                you reconsider?
              </p>
              <p>
                Do you still want to cancel your subscription?
              </p>
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
    </pg-dialog>

    <pg-dialog
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
    </pg-dialog>

    <!-- Chance Plan modal -->
    <pg-dialog
      v-model="changePlanModal"
      content-class="white"
      :fullscreen="isMobile"
      max-width="80%"
      persistent
    >
      <v-col cols="12">
        <v-row class="pr-3 mb-md-n12" justify="end">
          <v-btn class="white" icon @click.stop="closeChangePlanModal">
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
    </pg-dialog>

    <!-- Set Payment Method modal -->
    <pg-dialog
      v-model="setPaymentMethodModal"
      content-class="white"
      :fullscreen="isMobile"
      max-width="700px"
      persistent
    >
      <v-col cols="12">
        <v-row class="pr-3 mb-md-n12 mt-1" justify="start">
          <v-btn text class="accent--text text-none" @click="handlePaymentModalBackButton">
            <v-icon left>
              mdi-chevron-left
            </v-icon>
            Back to choose plan
          </v-btn>
        </v-row>

        <v-card flat class="mx-4 mt-12 mb-4">
          <stripe-pay-form
            description="We need your credit card information to confirm who you are."
            button-text="Start Learning"
            :cancelable="false"
            :is-free-for-days-text-visible="false"
            :loading="isPaymentMethodModalLoading"
            @click:submit="handlePaymentFormSubmit"
          >
            <template #header>
              <center class="pt-6">
                <underlined-title class="text-h6 text-md-h5" text="CREDIT CARD INFORMATION" />
              </center>
              <center class="grey--text text--darken-1 my-6 text-body-2">
                We need your credit card information to confirm who you are.
              </center>
            </template>
            <template #footer>
              <center>
                <div class="font-weight-bold grey--text text--darken-1 mt-6 mb-2 text-body-2">
                  You can cancel your trial and membership anytime from the account settings.
                </div>
              </center>
            </template>
          </stripe-pay-form>
        </v-card>
      </v-col>
    </pg-dialog>
  </v-row>
</template>

<script>
import dayjs from 'dayjs'
import { get } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import UpdateBillingMethod from '@/components/app/payment/UpdateBillingMethod'
import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'
import PlanDescription from '@/components/app/payment/SubscriptionPlanSelection/PlanDescription'
import TrialIsExpiring from '@/components/app/header/TrialIsExpiring.vue'
import StripePayForm from '@/components/forms/payment/StripePayForm.vue'
import { UserFlow } from '@/models'

export default {
  name: 'MembershipDetails',
  components: {
    UpdateBillingMethod,
    SubscriptionPlanSelection,
    PlanDescription,
    TrialIsExpiring,
    StripePayForm
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
        status: null,
        discountCode: null,
        stripeStatus: ''
      },
      cardToUpate: null,
      stripeCardModal: false,
      changePlanModal: false,
      setPaymentMethodModal: false,
      isPaymentMethodModalLoading: false,
      removeSubscriptionModal: false,
      userCards: [],
      plan: {}
    }
  },
  computed: {
    ...mapGetters('auth', ['getUserInfo']),
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
      return this.$vuetify.breakpoint.mobile
    },
    isTrialExpiringModalVisible () {
      const userInfo = this.getUserInfo
      const now = new Date()
      const dayInMinutes = 1440
      const threeDays = dayInMinutes * 3
      const timeLeft = dayjs(userInfo.trialEnd).diff(now, 'minute')

      if (timeLeft > threeDays) {
        return true
      }

      return false
    }
  },
  created () {
    this.getBillingDetails()
    this.getBillingCards()
    this.getPlan()
    this.$nuxt.$on('children-changed', this.getBillingDetails)
    this.$nuxt.$on('plan-membership-changed', this.getPlan)
  },
  mounted () {
    const val = this.$route.params.changeplan
    if (val && Boolean(val)) {
      this.changePlanModal = true
    }
  },
  beforeDestroy () {
    this.$nuxt.$off('children-changed')
    this.$nuxt.$off('plan-membership-changed')
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
      'removeBillingCard',
      'payShorterSubscription',
      'validateCard'
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
        this.billing.stripeStatus = data.stripeStatus || ''

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
          this.billing.discountCode = get(
            data,
            'subscriptionData.discount.coupon.name',
            null
          )
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

      if (this.getUserInfo.flow === UserFlow.NOCREDITCARD) {
        this.setPaymentMethodModal = true
      }
    },
    closeChangePlanModal () {
      this.changePlanModal = false
      if (this.$route.params.planRedirect) {
        this.$router.push({ name: this.$route.params.planRedirect })
      }
    },
    selectPlan () {
      this.$router.push({
        name: 'app-payment',
        params: { mode: 'activate-user' }
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
    },
    closePaymentMethodModal () {
      this.setPaymentMethodModal = false
    },
    async handlePaymentFormSubmit (cardData) {
      this.isPaymentMethodModalLoading = true

      try {
        const dataSubscrition = {
          token: cardData.token
        }

        if (cardData.promotion_id) {
          dataSubscrition.promotion_id = cardData.promotion_id
        }

        await this.payShorterSubscription(dataSubscrition)

        this.$snotify.success('Payment method set!')
        this.closePaymentMethodModal()
      } catch (e) {
      } finally {
        this.isPaymentMethodModalLoading = false
      }
    },
    handlePaymentModalBackButton () {
      this.closePaymentMethodModal()
      this.changePlanModal = true
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
