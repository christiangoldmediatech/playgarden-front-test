<template>
  <pg-loading :loading="loading">
    <v-row no-gutters data-test-id="membership-content" class="pa-4 pa-md-0">
      <!-- Membership Billing Information -->
      <v-col cols="12" md="6" class="mb-6 pr-md-8 mb-md-0">
        <v-card class="mb-6 pa-4 px-md-10 py-md-6 account-card-border" :style="{ '--card-custom-color': membershipColor }">
          <!-- Desktop Title -->
          <v-row no-gutters>
            <v-col cols="12">
              <div
                class="account-card-title"
              >
                Membership
              </div>
              <div class="py-2 account-card-subtitle">
                Information about your membership
              </div>
              <div class="account-pink-dashed-line my-4 mx-auto"></div>
            </v-col>
          </v-row>

          <div v-if="hasMembership">
            <!-- Trial Period Description -->
            <v-row v-if="billing.status === 'trialing'" no-gutters>
              <v-col cols="12">
                <span class="account-field-label">Free trial period ends:</span>
              </v-col>

              <v-col cols="12">
                <span class="account-field-label font-weight-bold">{{ billing.trialEndDate }}</span>
              </v-col>
            </v-row>

            <!-- Next Billing Date -->
            <v-row v-else no-gutters class="mb-3">
              <v-col cols="12">
                <span class="account-field-label">Your next billing date is:</span>
              </v-col>

              <v-col cols="12">
                <span class="account-field-label font-weight-bold">{{ billing.nextBillingDate }}</span>
              </v-col>
            </v-row>

            <!-- Monthly Membership Fee -->
            <v-row no-gutters class="mb-3">
              <v-col cols="12">
                <span class="account-field-label">Your {{ membershipInterval }} membership fee is:</span>
              </v-col>

              <v-col
                v-if="billing.planAmountDiscount"
                cols="12"
                class="account-field-label font-weight-bold"
              >
                <div>
                  <span>{{
                    billing.planAmountDiscount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })
                  }}</span>
                  <span class="strikethrough old_price grey--text">
                    {{
                      billing.planAmount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      })
                    }}
                  </span>
                </div>
              </v-col>
              <v-col
                v-else-if="billing.percentOff"
                cols="12"
                class="account-field-label font-weight-bold"
              >
                <div>
                  <span>{{
                    getTotalPay.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })
                  }}</span>
                  <span class="strikethrough old_price grey--text">
                    {{
                      billing.planAmount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      })
                    }}
                  </span>
                </div>
              </v-col>
              <v-col
                v-else
                cols="12"
                class="account-field-label font-weight-bold"
              >
                <div>
                  <span>
                    {{
                      billing.planAmount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      })
                    }}
                  </span>
                </div>
              </v-col>
            </v-row>

            <!-- Discount -->
            <v-row no-gutters>
              <template v-if="billing.planAmountDiscount || billing.percentOff">
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    class="account-field-label pg-py-0"
                  >
                    <span v-if="billing.planAmountDiscount || billing.percentOff">
                      Coupon applied:
                    </span>
                  </v-col>
                  <v-col cols="12" lg="4">
                    <span
                      class="account-field-label font-weight-bold pg-uppercase"
                    >
                      {{ billing.discountCode }}
                    </span>
                  </v-col>
                  <v-col cols="12" lg="8">
                    <div class="d-flex align-center">
                      <div v-if="!isMobile" class="account-line-separator mx-auto"></div>
                      <span
                        v-if="billing.percentOff"
                        class="account-field-label-small"
                      >
                        {{ billing.percentOff }} %
                      </span>
                      <span
                        v-if="billing.amountOff"
                        class="account-field-label-small"
                      >
                        $
                        {{
                          getAmountOff.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          })
                        }}
                      </span>
                      <span class="account-field-label-small">
                        discount on your membership
                      </span>
                      <v-icon color="#68C453" class="ml-2">
                        mdi-check-circle
                      </v-icon>
                    </div>
                  </v-col>
                </v-row>
              </template>

              <v-col cols="12" class="d-flex justify-center">
                <v-btn
                  class="rounded-0 elevation-0 my-4"
                  color="#F89838"
                  @click="viewAddCouponModal = true"
                >
                  <v-icon
                    color="white"
                    class="mr-2"
                  >
                    mdi-plus-circle
                  </v-icon>
                  <span class="white--text">
                    Add coupon code
                  </span>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>

        <add-coupon-modal
          v-model="viewAddCouponModal"
          @loadData="loadData"
        />

        <!-- Payment Method -->
        <membership-btn
          class="mb-4"
          title="Billing history"
          subtitle="View your billing history"
          color="#FAC3D9"
          text-color="#606060"
          @click="viewBillingHistory = true"
        />

        <billing-history-dialog v-model="viewBillingHistory" />

        <membership-btn
          title="Payment Method"
          :subtitle="cardMaskedNumber"
          color="#CFBCE3"
          text-color="#606060"
          @click="viewCardsModal = true"
        />

        <cards-modal
          v-model="viewCardsModal"
          :user-cards="userCards"
          @reloadBilling="onSuccessUpdateBilling"
        />
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

        <v-card class="account-plan-details">
          <v-row no-gutters>
            <!-- Plan Name-->
            <v-col cols="12" class="text-center">
              <div class="pg-rounded-[9px] py-3" :style="{ 'background': plan.color }">
                <div class="account-plan-text">
                  Your Plan is:
                </div>
                <div class="account-plan-name">
                  {{ plan.name }}
                </div>
              </div>
            </v-col>

            <!-- Plan Description -->
            <!-- TODO: The plan-description component expects an index that is not available
               when using the component separately, here we are using the (plan.id - 1) that
               returns an equivalent number, but we should update this component to accept
               maybe an id instead.[ch1440]
          -->
            <v-col cols="12" class="pa-4 px-md-10 py-md-6 ">
              <plan-description
                v-if="Object.keys(plan).length"
                :plan="plan"
                class="pg-mb-4"
              />
            </v-col>

            <!-- Change Plan Button -->
            <v-col
              v-if="billing.stripeStatus !== 'canceled'"
              cols="12"
              class="justify-center d-flex"
            >
              <membership-btn
                v-if="!isCaregiver"
                title="Change plan"
                subtitle="Change your plan whenever you want"
                color="#F89838"
                text-color="#FFFFFF"
                @click="handleChangePlan"
              />
            </v-col>
            <!-- Create Subscription -->
            <v-col
              v-else
              cols="12"
              class="justify-center d-flex"
            >
              <membership-btn
                v-if="!isCaregiver"
                title="Create membership"
                color="#F89838"
                text-color="#FFFFFF"
                @click="selectPlan"
              />
            </v-col>
          </v-row>
        </v-card>

        <v-col v-if="!isCaregiver" cols="12" class="justify-center d-flex">
          <!-- Cancel Subscription -->
          <v-btn
            v-if="hasMembership"
            block
            class="text-decoration-underline"
            color="#EA0000"
            x-large
            text
            @click="removeSubscriptionModal = true"
          >
            CANCEL MEMBERSHIP
          </v-btn>
          <!-- Create Subscription -->
          <!-- <v-btn v-else block color="primary" x-large @click="selectPlan">
            CREATE MEMBERSHIP
          </v-btn> -->
        </v-col>

        <!-- Learning Kits -->
        <div class="pg-mt-6 card-custom-border">
          <div class="text-center pa-4">
            <small class="v2-font pg-font-semibold pg-text-base pg-uppercase">
              Add-on
            </small>

            <h3
              class="v2-font pg-text-[#BA89EB] pg-text-3xl pg-font-semibold mb-2"
            >
              Learning Kits
            </h3>

            <p class="v2-font pg-text-medium">
              Add home delivery of the Learning Kits to any of the Enrollment
              Plans
            </p>

            <v-btn
              dark
              color="#D9B4FF"
              width="50%"
              x-large
              @click="learningKitsPopup = true"
            >
              View More
            </v-btn>
          </div>
        </div>

        <learning-kits-popup v-model="learningKitsPopup" />
      </v-col>

      <!-- Cancel suscription modal -->
      <cancel-suscription-modal
        :remove-subscription-modal="removeSubscriptionModal"
        :is-mobile="isMobile"
        :leave-motive="leaveMotive"
        :leave-motives="leaveMotivesText"
        :is-last-leave-motive="isLastLeaveMotive"
        :loading="loading"
        :is-validate-motive="isValidateMotive"
        @removeSubscription="getCancellationFlow"
        @removeSubscriptionModal="removeSubscriptionModal = false"
        @changeLeaveMotive="(e) => (leaveMotive = e)"
      />

      <annual-subscription-cancellation-modal
        v-model="viewAnnualCancellationModal"
        :reason-message="leaveMotive"
        :billing="billing"
        :plan-id="plan.id"
        @reloadInformation="reloadInformation"
      />

      <technical-issues-cancellation-modal
        v-model="viewTechnicalIssuesModal"
        :plan="plan"
        :plan-info="planInfo"
        :billing-type="billing.billingType"
        :reason-message="leaveMotive"
        @reloadInformation="reloadInformation"
      />
      <too-expensive-modal
        v-model="viewTooExpensiveModal"
        :plan="plan"
        :plan-info="planInfo"
        :billing-type="billing.billingType"
        :reason-message="leaveMotive"
        @reloadInformation="reloadInformation"
      />
      <using-other-platform-modal
        v-model="viewUsingOtherPlatformModal"
        :plan="plan"
        :plan-info="planInfo"
        :billing-type="billing.billingType"
        :reason-message="leaveMotive"
        @reloadInformation="reloadInformation"
      />
      <going-to-in-person-modal
        v-model="viewGoingToInPersonModal"
        :plan="plan"
        :plan-info="planInfo"
        :billing-type="billing.billingType"
        :reason-message="leaveMotive"
        @reloadInformation="reloadInformation"
      />
      <too-much-time-modal
        v-model="viewTooMuchTimeModal"
        :plan="plan"
        :plan-info="planInfo"
        :billing-type="billing.billingType"
        :reason-message="leaveMotive"
        @reloadInformation="reloadInformation"
      />
      <little-one-not-engaged-modal
        v-model="viewLittleOneNotEngagedModal"
        :plan="plan"
        :plan-info="planInfo"
        :billing-type="billing.billingType"
        :reason-message="leaveMotive"
        @reloadInformation="reloadInformation"
      />
      <did-not-use-enough-modal
        v-model="viewDidNotUseEnoughModal"
        :plan="plan"
        :plan-info="planInfo"
        :billing-type="billing.billingType"
        :reason-message="leaveMotive"
        @reloadInformation="reloadInformation"
      />
      <missing-features-modal
        v-model="viewMissingFeaturesModal"
        :plan="plan"
        :plan-info="planInfo"
        :billing-type="billing.billingType"
        :reason-message="leaveMotive"
        @reloadInformation="reloadInformation"
      />
      <did-not-meet-expectations
        v-model="viewDidNotMeetExpectations"
        :plan="plan"
        :plan-info="planInfo"
        :billing-type="billing.billingType"
        :reason-message="leaveMotive"
        @reloadInformation="reloadInformation"
      />
      <other-reason-modal
        v-model="viewOtherReasonModal"
        :plan="plan"
        :plan-info="planInfo"
        :billing-type="billing.billingType"
        :reason-message="leaveMotive"
        @reloadInformation="reloadInformation"
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

      <!-- Cancel Anyway Modal -->
      <cancel-anyway
        :view-cancel-anyway-modal="viewCancelAnywayModal"
        :is-mobile="isMobile"
        @closeCancelAnywayModal="viewCancelAnywayModal = false"
      />
    </v-row>
  </pg-loading>
</template>

<script>
import dayjs from 'dayjs'
import { get } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import AddCouponModal from '@/components/app/payment/AddCouponModal'
import CardsModal from '@/components/app/payment/CardsModal.vue'
import BillingHistoryDialog from '@/components/BillingHistoryDialog.vue'
import PlanDescription from '@/components/app/payment/SubscriptionPlanSelection/PlanDescription'
import MembershipBtn from '@/components/app/payment/MembershipBtn.vue'
import TrialIsExpiring from '@/components/app/header/TrialIsExpiring.vue'
import TechnicalIssuesCancellationModal from '@/components/app/payment/TechnicalIssuesCancellationModal.vue'
import TooMuchTimeModal from '@/components/app/payment/TooMuchTimeModal.vue'
import UsingOtherPlatformModal from '@/components/app/payment/UsingOtherPlatformModal.vue'
import LittleOneNotEngagedModal from '@/components/app/payment/LittleOneNotEngagedModal.vue'
import TooExpensiveModal from '@/components/app/payment/TooExpensiveModal.vue'
import DidNotUseEnoughModal from '@/components/app/payment/DidNotUseEnoughModal.vue'
import GoingToInPersonModal from '@/components/app/payment/GoingToInPersonModal.vue'
import MissingFeaturesModal from '@/components/app/payment/MissingFeaturesModal.vue'
import DidNotMeetExpectations from '@/components/app/payment/DidNotMeetExpectations.vue'
import OtherReasonModal from '@/components/app/payment/OtherReasonModal.vue'
import AnnualSubscriptionCancellationModal from '@/components/app/payment/AnnualSubscriptionCancellationModal.vue'
import LearningKitsPopup from './LearningKitsPopup.vue'
import CancelSuscriptionModal from './CancelSuscriptionModal.vue'
import CancelAnyway from './CancelSuscriptionFlow/CancelAnyway.vue'
import CouponDiscountModal from './CancelSuscriptionFlow/DiscountFlow/CouponDiscountModal.vue'
import PlayAndLearnProgramModal from './CancelSuscriptionFlow/PlayAndLearnFlow/PlayAndLearnProgramModal.vue'
import WelcomeToPlayAndLearnModal from './CancelSuscriptionFlow/PlayAndLearnFlow/WelcomeToPlayAndLearnModal.vue'
import TryPlayAndLearnModal from './CancelSuscriptionFlow/DiscountFlow/TryPlayAndLearnModal.vue'
import AppliedCouponModal from './CancelSuscriptionFlow/DiscountFlow/AppliedCouponModal.vue'

export default {
  name: 'MembershipDetails',
  components: {
    AddCouponModal,
    CardsModal,
    BillingHistoryDialog,
    PlanDescription,
    MembershipBtn,
    TrialIsExpiring,
    // CancelTrial: () => import('@/components/app/payment/CancelTrial.vue')
    CancelSuscriptionModal,
    CancelAnyway,
    CouponDiscountModal,
    PlayAndLearnProgramModal,
    WelcomeToPlayAndLearnModal,
    TryPlayAndLearnModal,
    AppliedCouponModal,
    LearningKitsPopup,
    TooMuchTimeModal,
    TechnicalIssuesCancellationModal,
    TooExpensiveModal,
    UsingOtherPlatformModal,
    GoingToInPersonModal,
    LittleOneNotEngagedModal,
    DidNotUseEnoughModal,
    MissingFeaturesModal,
    DidNotMeetExpectations,
    OtherReasonModal,
    AnnualSubscriptionCancellationModal
  },

  data: () => ({
    loading: false,
    viewAddCouponModal: false,
    viewCardsModal: false,
    viewBillingHistory: false,
    isValidCoupon: false,
    isValidatingCoupon: false,
    promotionCode: null,
    promotion_id: null,
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
    removeSubscriptionModal: false,
    userCards: [],
    plan: {},
    planInfo: {},
    leaveMotive: '',
    leaveMotives: [
      {
        motive: 'Repeated technical issues',
        modal: TechnicalIssuesCancellationModal.name
      },
      {
        motive: 'Too expensive',
        modal: TooExpensiveModal.name
      },
      {
        motive: 'Using another learning platform',
        modal: UsingOtherPlatformModal.name
      },
      {
        motive: 'Going to in person school',
        modal: GoingToInPersonModal.name
      },
      {
        motive: 'Too much time commitment',
        modal: TooMuchTimeModal.name
      },
      {
        motive: "My little one wasn't engaged",
        modal: LittleOneNotEngagedModal.name
      },
      {
        motive: "Didn't use it enough",
        modal: DidNotUseEnoughModal.name
      },
      {
        motive: 'Missing features I need',
        modal: MissingFeaturesModal.name
      },
      {
        motive: "Didn't meet my expectations",
        modal: DidNotMeetExpectations.name
      },
      {
        motive: 'Other (please explain)',
        modal: OtherReasonModal.name
      }
    ],
    learnAndPlayWasCanceled: false,
    viewTechnicalIssuesModal: false,
    viewTooExpensiveModal: false,
    viewUsingOtherPlatformModal: false,
    viewGoingToInPersonModal: false,
    viewTooMuchTimeModal: false,
    viewLittleOneNotEngagedModal: false,
    viewDidNotUseEnoughModal: false,
    viewMissingFeaturesModal: false,
    viewDidNotMeetExpectations: false,
    viewOtherReasonModal: false,
    viewAnnualCancellationModal: false,
    // Discount Flow
    viewCouponDiscountModal: false,
    viewTryPlayAndLearnModal: false,
    viewAppliedCouponModal: false,
    // PAL Program Flow
    viewPlayAndLearnProgramModal: false,
    viewWelcomeToPlayAndLearnModal: false,
    // PAL Cancellation Flow
    viewPlayAndLearnDiscountModal: false,
    // Cancel Anyway Modal
    viewCancelAnywayModal: false,
    learningKitsPopup: false
  }),
  computed: {
    ...mapGetters('auth', ['getUserInfo']),

    ...mapGetters('auth', ['hasPlayAndLearnPlan']),

    membershipColor() {
      return '255, 160, 200'
    },

    leaveMotivesText() {
      return this.leaveMotives.map((motives) => motives.motive)
    },

    isLastLeaveMotive() {
      return (
        this.leaveMotives[this.leaveMotives.length - 1].motive ===
        this.leaveMotive
      )
    },

    cardMaskedNumber() {
      const card = this.userCards[0]

      if (card) {
        return `${card.details.brand} •••• •••• •••• ${card.details.last4}`
      }

      return ''
    },

    isCaregiver() {
      return this.getUserInfo.role.id === 4
    },

    isValidateMotive() {
      return !this.leaveMotive
    },

    getTotalPay() {
      return (
        (this.billing.percentOff * this.billing.planAmount) / 100 -
        this.billing.planAmount
      ).toFixed(2)
    },

    getAmountOff() {
      return (this.billing.amountOff / 100).toFixed(2)
    },

    hasMembership() {
      const status = this.billing.status
      return (
        !status ||
        (status !== 'incomplete' &&
          status !== 'incomplete_expired' &&
          status !== 'canceled')
      )
    },
    isTrialingStatus() {
      return this.billing.status === 'trialing'
    },
    membershipInterval() {
      switch (this.billing.membershipInterval) {
        case 'month':
          return 'monthly'
        case 'year':
          return 'yearly'
      }
      return null
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    isTrialExpiringRibbonVisible() {
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
      if (this.hasPlayAndLearnPlan) {
        if (this.billing.billingType === 'MONTHLY') {
          return 'PLPROMOMONTHLY'
        }

        return 'PLANNUALLY'
      }

      return 'PSPROMO'
    },
    couponCodeToDisplay() {
      if (this.hasPlayAndLearnPlan) {
        return 'PLAYANDLEARNPROMO'
      }

      return 'COUPONTHREEMONTHS'
    }
  },
  watch: {
    promotionCode(val) {
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
  async created() {
    await this.loadData()
  },
  mounted() {
    this.handleRouteAction()
  },
  beforeDestroy() {
    this.$nuxt.$off('children-changed')
    this.$nuxt.$off('plan-membership-changed')
  },
  methods: {
    ...mapActions('coupons', ['getCoupons', 'updateSubcriptionCoupon']),
    ...mapActions(['disableAxiosGlobal', 'enableAxiosGlobal']),
    ...mapActions('plans', ['fetchLatestCancellationReason']),

    ...mapActions('auth', {
      fetchUserInfoIntoStore: 'fetchUserInfo'
    }),
    ...mapActions('payment', [
      'getSelectedSubscriptionPlan',
      'fetchSubscriptionPlanById',
      'cancelSubscription',
      'fetchBillingCards',
      'fetchBillingDetails',
      'removeBillingCard'
    ]),

    handleCancelMembershipClick() {
      this.resetCancellationFlowsControls()
      this.leaveMotive = ''
      this.removeSubscriptionModal = true
    },

    async loadData() {
      await this.getBillingDetails()
      await this.getBillingCards()
      await this.fetchLatestCancellationReason()
      await this.getPlan()
      this.$nuxt.$on('children-changed', this.getBillingDetails)
      this.$nuxt.$on('plan-membership-changed', this.getPlan)
    },

    async savePromotion() {
      try {
        this.loading = true
        await this.updateSubcriptionCoupon({ promotion_id: this.promotion_id })
        await this.loadData()
      } catch (err) {
      } finally {
        this.promotion_id = null
        this.promotionCode = null
        this.loading = false
        this.addCoupon = false
      }
    },

    closeCouponModal() {
      this.promotion_id = null
      this.promotionCode = null
      this.addCoupon = false
    },

    handleRouteAction() {
      const action = this.$route.query.action

      switch (action) {
        case 'select-plan':
          this.handleChangePlan()
          break
        default:
          break
      }
    },

    async getBillingDetails() {
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
    async getBillingCards() {
      try {
        this.loading = true
        this.userCards = await this.fetchBillingCards()
      } finally {
        this.loading = false
      }
    },
    onUpdateCard(card) {
      this.stripeCardModal = true
      this.cardToUpate = card
    },

    async removePaymentMethod(card) {
      if (card && card.id) {
        await this.removeBillingCard(card.id)
        this.getBillingCards()
        this.getBillingDetails()
      }
    },
    async removeLearnAndPlaySubscription() {
      this.learnAndPlayWasCanceled = true
      await this.removeSubscription(false)
    },
    async reloadInformation(reloadPlan = false) {
      try {
        this.loading = true
        // update auser info on store
        await this.fetchUserInfoIntoStore()
        await this.getBillingDetails()
        await this.fetchLatestCancellationReason()
        await this.getBillingCards()

        if (reloadPlan) {
          await this.getPlan()
        }
      } catch (e) {
        // In the future we can handle the error
      } finally {
        this.loading = false
      }
    },

    resetCancellationFlowsControls() {
      this.viewAnnualCancellationModal = false
      this.viewTechnicalIssuesModal = false
      this.viewTooExpensiveModal = false
      this.viewUsingOtherPlatformModal = false
      this.viewGoingToInPersonModal = false
      this.viewTooMuchTimeModal = false
      this.viewLittleOneNotEngagedModal = false
      this.viewDidNotUseEnoughModal = false
      this.viewMissingFeaturesModal = false
      this.viewDidNotMeetExpectations = false
      this.viewOtherReasonModal = false
    },

    getCancellationFlow() {
      const leaveMotive = this.leaveMotives.find(
        (motive) => motive.motive === this.leaveMotive
      )

      if (this.billing.billingType === 'ANNUAL') {
        this.viewAnnualCancellationModal = true
      } else if (leaveMotive.modal === TechnicalIssuesCancellationModal.name) {
        this.viewTechnicalIssuesModal = true
      } else if (leaveMotive.modal === TooExpensiveModal.name) {
        this.viewTooExpensiveModal = true
      } else if (leaveMotive.modal === UsingOtherPlatformModal.name) {
        this.viewUsingOtherPlatformModal = true
      } else if (leaveMotive.modal === GoingToInPersonModal.name) {
        this.viewGoingToInPersonModal = true
      } else if (leaveMotive.modal === TooMuchTimeModal.name) {
        this.viewTooMuchTimeModal = true
      } else if (leaveMotive.modal === LittleOneNotEngagedModal.name) {
        this.viewLittleOneNotEngagedModal = true
      } else if (leaveMotive.modal === DidNotUseEnoughModal.name) {
        this.viewDidNotUseEnoughModal = true
      } else if (leaveMotive.modal === MissingFeaturesModal.name) {
        this.viewMissingFeaturesModal = true
      } else if (leaveMotive.modal === DidNotMeetExpectations.name) {
        this.viewDidNotMeetExpectations = true
      } else if (leaveMotive.modal === OtherReasonModal.name) {
        this.viewOtherReasonModal = true
      }

      this.removeSubscriptionModal = false
    },
    onSuccessUpdateBilling() {
      this.getBillingCards()
      this.getBillingDetails()
    },
    selectPlan() {
      this.$router.push({
        name: 'app-payment',
        params: { mode: 'activate-user' }
      })
    },
    async getPlan() {
      try {
        this.disableAxiosGlobal()
        const response = await this.getSelectedSubscriptionPlan()
        const planInfo = await this.fetchSubscriptionPlanById(response.plan.id)
        this.plan = response.plan
        this.planInfo = planInfo
      } catch (e) {
      } finally {
        this.enableAxiosGlobal()
      }
    },
    handleChangePlan() {
      this.$router.push({
        name: 'app-payment-plan'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';

.v-btn:not(.v-btn--text) {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
}

.add-coupon {
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

.note-text {
  font-size: 10px !important;
  text-align: justify !important;
  font-weight: bold !important;
}
.strikethrough:before {
  position: absolute;
  color: var(--v-accent-base) !important;
  content: '';
  left: 0;
  top: 50%;
  right: 0;
  border-top: 1px solid;
  border-color: inherit;

  -webkit-transform: rotate(-10deg);
  -moz-transform: rotate(-10deg);
  -ms-transform: rotate(-10deg);
  -o-transform: rotate(-10deg);
  transform: rotate(-10deg);
}
.strikethrough:after {
  position: absolute;
  color: var(--v-accent-base) !important;
  content: '';
  left: 0;
  top: 50%;
  right: 0;
  border-top: 1px solid;
  border-color: inherit;

  -webkit-transform: rotate(10deg);
  -moz-transform: rotate(10deg);
  -ms-transform: rotate(10deg);
  -o-transform: rotate(10deg);
  transform: rotate(10deg);
}
</style>
