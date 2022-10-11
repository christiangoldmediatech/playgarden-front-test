<template>
  <pg-loading :loading="loading">
    <v-row no-gutters data-test-id="membership-content">
      <!-- Desktop Title -->
      <v-col cols="12" class="d-none d-md-block">
        <div class="pb-6 text-uppercase font-weight-bold text-h4 grey--text text--darken-2">
          Membership
        </div>
      </v-col>

      <!-- Membership Billing Information -->
      <v-col cols="12" md="6" class="mb-6 pr-md-8 mb-md-0">
        <v-card class="mb-6 pa-4 px-md-10 py-md-6 card-custom-border">
          <!-- Desktop SVG -->
          <div class="justify-center pb-4 d-none d-md-flex">
            <img
              height="100px"
              src="@/assets/svg/membership.svg"
            >
          </div>

          <!-- Mobile SVG and Title= -->
          <div class="justify-center py-2 d-flex d-md-none">
            <img
              height="45px"
              src="@/assets/svg/membership.svg"
            >
            <span class="mt-1 ml-2 text-uppercase font-weight-bold text-h5 grey--text text--darken-2">
              Membership
            </span>
          </div>

          <div class="my-2 text-center body-1 text-md-h6 font-weight-medium grey--text text--darken-2">
            <small class="font-weight-bold">Information about your membership</small>
          </div>

          <div v-if="hasMembership">
            <!-- Trial Period Description -->
            <v-row v-if="billing.status === 'trialing'" no-gutters>
              <v-col cols="12" class="mb-1 text-h6 grey--text">
                <small>Free trial period ends:</small>
              </v-col>

              <v-col cols="12" class="mb-1 text-h6 black--text font-weight-bold">
                {{ billing.trialEndDate }}
              </v-col>
            </v-row>

            <!-- Next Billing Date -->
            <v-row v-else no-gutters class="mb-3">
              <v-col cols="12" class="mb-1 text-h6 grey--text">
                <small>Your next billing date is:</small>
              </v-col>

              <v-col cols="12" class="mb-1 text-h6 grey--text font-weight-bold">
                {{ billing.nextBillingDate }}
              </v-col>
            </v-row>

            <!-- Monthly Membership Fee -->
            <v-row no-gutters class="mb-3">
              <v-col cols="12" class="mb-1 text-h6 grey--text">
                <small>Your {{ membershipInterval }} membership fee is:</small>
              </v-col>

              <v-col v-if="billing.planAmountDiscount" cols="12" class="mb-1 text-h6 black--text font-weight-bold">
                <div>
                  <span>{{
                    billing.planAmountDiscount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }}</span>
                  <span class="strikethrough old_price grey--text">
                    {{
                      billing.planAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })
                    }}
                  </span>
                </div>
              </v-col>
              <v-col v-else-if="billing.percentOff" cols="12" class="mb-1 text-h6 black--text font-weight-bold">
                <div>
                  <span>{{
                    getTotalPay.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }}</span>
                  <span class="strikethrough old_price grey--text">
                    {{
                      billing.planAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })
                    }}
                  </span>
                </div>
              </v-col>
              <v-col v-else cols="12" class="mb-1 text-h6 black--text font-weight-bold">
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
            <v-row>
              <v-col cols="5" class="mb-1 pg-text-base pg-font-medium grey--text pg-py-0">
                <span v-if="billing.planAmountDiscount || billing.percentOff">Coupon applied:</span>
              </v-col>
              <v-col cols="7" class="justify-end mb-1 pg-py-0">
                <div class="text-right md:pg-text-base" @click="addCoupon = !addCoupon">
                  <span class="text-decoration-underline add-coupon">
                    <span>Add coupon code</span>
                  </span>
                  <v-icon small color="accent" class="text-h7 hidden-md-and-down">
                    mdi-plus
                  </v-icon>
                </div>
              </v-col>

              <template v-if="billing.planAmountDiscount || billing.percentOff" no-gutters>
                <v-col class="mt-1" cols="12" md="5">
                  <span class="mb-3 text-h7 black--text font-weight-bold pg-uppercase">{{ billing.discountCode }}</span>
                </v-col>

                <v-col cols="12" md="7" class="mt-1 mb-3">
                  <div class="text-right">
                    <span v-if="billing.percentOff" class="mb-3 discount grey--text font-weight-bold">
                      {{ billing.percentOff }} %
                    </span>
                    <span v-if="billing.amountOff" class="mb-3 discount grey--text font-weight-bold">
                      $ {{
                        getAmountOff.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                      }}
                    </span>
                    <small class="grey--text font-weight-bold discount">discount on your membership</small>
                  </div>
                </v-col>
              </template>

              <v-col v-if="addCoupon" class="mt-2" cols="12">
                <v-row no-gutters>
                  <pg-text-field
                    v-model="promotionCode"
                    label="Promotion Code"
                    :color="isValidCoupon ? '' : 'error'"
                    :suffix="getTextValidateCoupon"
                    :loading="isValidatingCoupon"
                    solo
                  />
                  <v-btn
                    :disabled="!isValidCoupon"
                    color="primary"
                    class="mb-3"
                    x-large
                    block
                    @click="savePromotion"
                  >
                    APPLY COUPON
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-card>
        <!-- Payment Method -->
        <v-card class="mb-6 pa-4 px-md-10 py-md-6 card-custom-border">
          <v-row no-gutters class="text-uppercase font-weight-bold text-h5 grey--text text--darken-2" justify="center">
            Payment Method
          </v-row>
          <v-row
            v-for="(card, indexUC) in userCards"
            :key="indexUC"
            align="center"
            no-gutters
          >
            <v-col cols="4" class="mt-8 text-center text-subtitle-2 text-sm-h6 grey--text font-weight-bold">
              {{ card.details.brand }}
            </v-col>
            <v-col cols="8" class="mt-8 text-center text-subtitle-2 text-sm-h6 grey--text font-weight-bold">
              •••• •••• •••• {{ card.details.last4 }}
            </v-col>
            <v-col cols="12" class="justify-center mt-8 d-flex">
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
          <v-row v-if="userCards.length === 0">
            <v-col cols="12" class="mb-1 grey--text">
              <span>To add a Payment Method, select a Payment Plan below.</span>
            </v-col>
            <v-col cols="12">
              <v-btn
                color="primary mb-3"
                x-large
                block
                @click="handleChangePlan"
              >
                CHOOSE PLAN
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <billing-history-card />
      </v-col>

      <!-- Plan Information -->
      <v-col cols="12" md="6" class="mb-6 pl-md-8 mb-md-0">
        <!-- CANCEL TRIAL BUTTON -->
        <!-- <cancel-trial
          v-if="isTrialingStatus"
          class="pg-mb-[32px]"
        /> -->

        <!-- TRIAL EXPIRING RIBBON -->
        <trial-is-expiring
          v-if="isTrialExpiringRibbonVisible"
          :is-fixed-on-top="false"
          :is-compare-plans-button-visible="false"
        />
        <v-card class="pa-4 px-md-10 py-md-6 card-custom-border">
          <v-row no-gutters>
            <!-- Plan Name-->
            <v-col cols="12" class="text-center">
              <div class="mb-6 text-uppercase font-weight-bold text-h5 grey--text text--darken-2">
                Your Plan
              </div>
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
            <plan-description
              v-if="Object.keys(plan).length"
              :plan="plan"
              class="pg-mb-4"
            />

            <!-- Change Plan Button -->
            <v-col v-if="billing.stripeStatus !== 'canceled'" cols="12" class="justify-center d-flex">
              <v-btn
                v-if="!isCaregiver"
                color="primary mb-3"
                x-large
                block
                @click="handleChangePlan"
              >
                CHANGE PLAN
              </v-btn>
            </v-col>

            <v-col v-if="!isCaregiver" cols="12" class="justify-center d-flex">
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
      <cancel-suscription-modal
        :remove-subscription-modal="removeSubscriptionModal"
        :is-mobile="isMobile"
        :leave-motive="leaveMotive"
        :leave-motives="leaveMotivesText"
        :is-last-leave-motive="isLastLeaveMotive"
        :other-leave-motive="otherLeaveMotive"
        :loading="loading"
        :is-validate-motive="isValidateMotive"
        @removeSubscription="removeSubscription"
        @removeSubscriptionModal="removeSubscriptionModal = false"
        @changeLeaveMotive="e => (leaveMotive = e)"
        @changeOtherLeaveMotive="e => (otherLeaveMotive = e)"
      />

      <!-- Discount Flow -->
      <coupon-discount-modal
        :view-coupon-discount-modal="viewCouponDiscountModal"
        :billing-type="billing.billingType"
        :discount-code="couponCode"
        @tryPlayAndLearnModal="viewTryPlayAndLearnModal = true"
        @closeCouponDiscountModal="viewCouponDiscountModal = false"
        @appliedCouponModal="viewAppliedCouponModal = true"
        @cancelPlayAndLearnModal="cancelPlayAndLearnModal = true"
        @cancelLearnAndPlayAccount="removeLearnAndPlaySubscription"
      />
      <try-play-and-learn-modal
        :view-try-play-and-learn-modal="viewTryPlayAndLearnModal"
        @cancelAccount="removeSubscription(false)"
        @closeTryPlayAndLearnModal="viewTryPlayAndLearnModal = false"
        @viewWelcomePlayAndLearn="viewWelcomeToPlayAndLearnModal = true"
      />
      <applied-coupon-modal
        :view-applied-coupon-modal="viewAppliedCouponModal"
        :billing="billing"
        :discount-code="couponCodeToDisplay"
        @closeViewAppliedCouponModal="viewAppliedCouponModal = false"
      />

      <!-- Play and Learn Flow -->
      <play-and-learn-program-modal
        :view-play-and-learn-program-modal="viewPlayAndLearnProgramModal"
        @closePlayAndLearnProgramModal="viewPlayAndLearnProgramModal = false"
        @cancelAccount="removeSubscription(false)"
        @loadingMode="loading = $event"
        @viewWelcomePlayAndLearn="viewWelcomeToPlayAndLearnModal = true"
      />
      <welcome-to-play-and-learn-modal
        :view-welcome-to-play-and-learn-modal="viewWelcomeToPlayAndLearnModal"
      />
      <cancel-play-and-learn-modal
        :cancel-play-and-learn-modal="cancelPlayAndLearnModal"
        @closeCancelPlayAndLearnModal="cancelPlayAndLearnModal = false"
      />

      <!-- Cancel Anyway Modal -->
      <cancel-anyway
        :view-cancel-anyway-modal="viewCancelAnywayModal"
        :is-mobile="isMobile"
        @closeCancelAnywayModal="viewCancelAnywayModal = false"
      />

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
    </v-row>
  </pg-loading>
</template>

<script>
import dayjs from 'dayjs'
import { get } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import UpdateBillingMethod from '@/components/app/payment/UpdateBillingMethod'
import PlanDescription from '@/components/app/payment/SubscriptionPlanSelection/PlanDescription'
import TrialIsExpiring from '@/components/app/header/TrialIsExpiring.vue'
import BillingHistoryCard from '@/components/BillingHistoryCard.vue'
import debounce from 'lodash/debounce'
import CancelSuscriptionModal from './CancelSuscriptionModal.vue'
import CancelAnyway from './CancelSuscriptionFlow/CancelAnyway.vue'
import CouponDiscountModal from './CancelSuscriptionFlow/DiscountFlow/CouponDiscountModal.vue'
import PlayAndLearnProgramModal from './CancelSuscriptionFlow/PlayAndLearnFlow/PlayAndLearnProgramModal.vue'
import WelcomeToPlayAndLearnModal from './CancelSuscriptionFlow/PlayAndLearnFlow/WelcomeToPlayAndLearnModal.vue'
import TryPlayAndLearnModal from './CancelSuscriptionFlow/DiscountFlow/TryPlayAndLearnModal.vue'
import AppliedCouponModal from './CancelSuscriptionFlow/DiscountFlow/AppliedCouponModal.vue'
import CancelPlayAndLearnModal from './CancelSuscriptionFlow/DiscountFlow/CancelPlayAndLearnModal.vue'

export default {
  name: 'MembershipDetails',
  components: {
    UpdateBillingMethod,
    PlanDescription,
    TrialIsExpiring,
    BillingHistoryCard,
    // CancelTrial: () => import('@/components/app/payment/CancelTrial.vue')
    CancelSuscriptionModal,
    CancelAnyway,
    CouponDiscountModal,
    PlayAndLearnProgramModal,
    WelcomeToPlayAndLearnModal,
    TryPlayAndLearnModal,
    AppliedCouponModal,
    CancelPlayAndLearnModal
  },

  data: vm => ({
    loading: false,
    addCoupon: false,
    isValidCoupon: false,
    isValidatingCoupon: false,
    promotionCode: null,
    promotion_id: null,
    checkValid: debounce(vm._checkValid, 1050),
    billing: {
      billingType: '',
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
    removeSubscriptionModal: false,
    userCards: [],
    plan: {},
    leaveMotive: '',
    otherLeaveMotive: '',
    leaveMotives: [
      {
        motive: 'Repeated technical issues',
        couponDiscountFlow: true
      },
      {
        motive: 'Too expensive',
        couponDiscountFlow: true
      },
      {
        motive: 'Using another learning platform',
        couponDiscountFlow: false
      },
      {
        motive: 'Going to in person school',
        couponDiscountFlow: false
      },
      {
        motive: 'Too much time commitment',
        couponDiscountFlow: false
      },
      {
        motive: 'My little one wasn\'t engaged',
        couponDiscountFlow: false
      },
      {
        motive: 'Didn\'t use it enough',
        couponDiscountFlow: true
      },
      {
        motive: 'Missing features I need',
        couponDiscountFlow: true
      },
      {
        motive: 'Didn\'t meet my expectations',
        couponDiscountFlow: true
      },
      {
        motive: 'Other (please explain)',
        couponDiscountFlow: false
      }
    ],
    learnAndPlayWasCanceled: false,
    // Discount Flow
    viewCouponDiscountModal: false,
    viewTryPlayAndLearnModal: false,
    viewAppliedCouponModal: false,
    // PAL Program Flow
    viewPlayAndLearnProgramModal: false,
    viewWelcomeToPlayAndLearnModal: false,
    cancelPlayAndLearnModal: false,
    // PAL Cancellation Flow
    viewPlayAndLearnDiscountModal: false,
    // Cancel Anyway Modal
    viewCancelAnywayModal: false
  }),
  computed: {
    ...mapGetters('auth', ['getUserInfo']),

    ...mapGetters('auth', ['hasUserLearnAndPlayPlan']),

    leaveMotivesText() {
      return this.leaveMotives.map(motives => motives.motive)
    },

    isLastLeaveMotive () {
      return this.leaveMotives[this.leaveMotives.length - 1].motive === this.leaveMotive
    },

    isCaregiver () {
      return (this.getUserInfo.role.id === 4)
    },

    getTextValidateCoupon () {
      if (this.promotionCode) {
        return (this.isValidCoupon) ? 'VALID COUPON' : 'INVALID COUPON'
      } else {
        return ''
      }
    },

    isValidateMotive() {
      if (this.leaveMotive === 'Other (please explain)') {
        return this.otherLeaveMotive === '' || this.otherLeaveMotive.length < 5
      } else {
        return !this.leaveMotive
      }
    },

    getTotalPay () {
      return (((this.billing.percentOff * this.billing.planAmount) / 100) - this.billing.planAmount).toFixed(2)
    },

    getAmountOff () {
      return (this.billing.amountOff / 100).toFixed(2)
    },

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
    isTrialExpiringRibbonVisible () {
      if (this.billing.status !== 'trialing') {
        return false
      }
      const userInfo = this.getUserInfo
      const now = new Date()
      const dayInMinutes = 1440
      const threeDaysInMinutes = dayInMinutes * 3
      const timeLeftInMinutes = dayjs(userInfo.trialEnd).diff(now, 'minute')

      if (timeLeftInMinutes > threeDaysInMinutes) {
        return true
      }

      return false
    },
    couponCode() {
      if (this.hasUserLearnAndPlayPlan) {
        if (this.billing.billingType === 'MONTHLY') {
          return 'PLPROMOMONTHLY'
        }

        return 'PLANNUALLY'
      }

      return 'PSPROMO'
    },
    couponCodeToDisplay() {
      if (this.hasUserLearnAndPlayPlan) {
        return 'PLAYANDLEARNPROMO'
      }

      return 'COUPONTHREEMONTHS'
    }
  },
  watch: {
    promotionCode (val) {
      if (val) {
        this.promotionCode = val.toUpperCase()
        this.isValidCoupon = false

        if (val.length >= 5) {
          this.checkValid()
        }
      } else {
        this.promotion_id = null
      }
    }
  },
  created () {
    this.loadData()
  },
  mounted () {
    this.handleRouteAction()
  },
  beforeDestroy () {
    this.$nuxt.$off('children-changed')
    this.$nuxt.$off('plan-membership-changed')
  },
  methods: {
    ...mapActions('coupons', ['getCoupons', 'updateSubcriptionCoupon']),
    ...mapActions(['disableAxiosGlobal', 'enableAxiosGlobal']),

    ...mapActions('auth', {
      fetchUserInfoIntoStore: 'fetchUserInfo'
    }),
    ...mapActions('payment', [
      'getSelectedSubscriptionPlan',
      'cancelSubscription',
      'fetchBillingCards',
      'fetchBillingDetails'
    ]),

    loadData () {
      this.getBillingDetails()
      this.getBillingCards()
      this.getPlan()
      this.$nuxt.$on('children-changed', this.getBillingDetails)
      this.$nuxt.$on('plan-membership-changed', this.getPlan)
    },

    async savePromotion () {
      try {
        this.loading = true
        await this.updateSubcriptionCoupon({ promotion_id: this.promotion_id })
        this.loadData()
      } catch (err) {
      } finally {
        this.promotion_id = null
        this.promotionCode = null
        this.loading = false
        this.addCoupon = false
      }
    },

    closeCouponModal () {
      this.promotion_id = null
      this.promotionCode = null
      this.addCoupon = false
    },

    handleRouteAction () {
      const action = this.$route.query.action

      switch (action) {
        case 'select-plan':
          this.handleChangePlan()
          break
        default:
          break
      }
    },

    async _checkValid () {
      try {
        this.isValidatingCoupon = true
        if (this.promotionCode) {
          const coupons = await this.getCoupons({ active: true, code: this.promotionCode })
          if (coupons.length > 0) {
            this.promotion_id = coupons[0].promotion_id
            this.isValidCoupon = true
            this.lockButton = false
          } else {
            this.isValidCoupon = false
            this.promotion_id = null
          }
        }
      } catch (error) {
        this.isValidCoupon = false
        this.lockButton = true
      } finally {
        this.isValidatingCoupon = false
      }
    },

    async getBillingDetails () {
      try {
        this.loading = true
        const data = await this.fetchBillingDetails()
        this.billing.billingType = data.billingType
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
    async removeLearnAndPlaySubscription() {
      this.learnAndPlayWasCanceled = true
      await this.removeSubscription(false)
    },
    async removeSubscription (ignoreFlow = true) {
      if (ignoreFlow) {
        this.getCancelationFlow()
        return
      }

      try {
        this.loading = true
        const reason = this.isLastLeaveMotive ? (this.otherLeaveMotive || this.leaveMotive) : this.leaveMotive
        await this.cancelSubscription(reason)
        this.$snotify.success('Subscription has been canceled successfully!')
        await this.getBillingDetails()
        // update auser info on store
        await this.fetchUserInfoIntoStore()
        this.removeSubscriptionModal = false
      } catch (e) {
        // In the future we can handle the error
      } finally {
        this.loading = false
        if (this.learnAndPlayWasCanceled) {
          this.cancelPlayAndLearnModal = true
        } else {
          this.viewCancelAnywayModal = true
        }
      }
    },
    getCancelationFlow () {
      const leaveMotive = this.leaveMotives.find(motive => motive.motive === this.leaveMotive)

      if (leaveMotive.couponDiscountFlow || this.hasUserLearnAndPlayPlan) {
        this.viewCouponDiscountModal = true
      } else {
        this.viewPlayAndLearnProgramModal = true
      }

      this.removeSubscriptionModal = false
    },
    onSuccessUpdateBilling () {
      this.stripeCardModal = false
      this.getBillingCards()
      this.getBillingDetails()
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
    handleChangePlan () {
      this.$router.push({
        name: 'app-payment-plan'
      })
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

.add-coupon{
  color: var(--v-accent-base) !important;
  font-weight: 500 !important;
  cursor: pointer !important;
}

.old_price {
  font-size: 13px !important;
}

.discount {
  font-size: 12px !important;
}

.strikethrough {
  position: relative;
}
.strikethrough:before {
  position: absolute;
  color: var(--v-accent-base) !important;
  content: "";
  left: 0;
  top: 50%;
  right: 0;
  border-top: 1px solid;
  border-color: inherit;

  -webkit-transform:rotate(-10deg);
  -moz-transform:rotate(-10deg);
  -ms-transform:rotate(-10deg);
  -o-transform:rotate(-10deg);
  transform:rotate(-10deg);
}
.strikethrough:after {
  position: absolute;
  color: var(--v-accent-base) !important;
  content: "";
  left: 0;
  top: 50%;
  right: 0;
  border-top: 1px solid;
  border-color: inherit;

  -webkit-transform:rotate(10deg);
  -moz-transform:rotate(10deg);
  -ms-transform:rotate(10deg);
  -o-transform:rotate(10deg);
  transform:rotate(10deg);
}
</style>
