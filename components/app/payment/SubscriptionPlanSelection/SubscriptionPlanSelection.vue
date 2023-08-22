<template>
  <div v-if="initialized" class="pg-w-full">
    <!-- Bill monthly/anually switch -->
    <div class="pg-flex pg-justify-center">
      <div class="pg-flex pg-items-center">
        <span class="pg-mr-3 pg-text-[14px] sm:pg-text-xl pg-font-semibold">Bill Monthly</span>
        <v-switch v-model="billBiannually" color="#FFA0C8" inset />
        <span class="pg-block pg-mt-[15px] sm:pg-mt-0 pg-text-[14px] sm:pg-text-xl pg-font-semibold">
          Bill by Semester <br v-if="$vuetify.breakpoint.xs" />
          <span class="pg-font-normal pg-text-[12px] sm:pg-text-xl">(6 months)</span>
        </span>
      </div>
    </div>

    <payment-information-dialog
      v-model="paymentInfoDialog"
      :plan="selectedPlan"
      :bill-annually="billBiannually"
      :from-playdates="fromPlaydates"
      :draft="draft"
    />

    <!-- Plan columns -->
    <v-row class="pg-w-[95%] pg-max-w-[1300px] pg-m-auto">
      <v-col
        v-for="plan in plans"
        :key="plan.name"
        cols="12"
        :md="Math.ceil(12 / plans.length)"
      >
        <div
          class="card-shadow pg-rounded-[3px] pg-bg-white"
          :class="{
            'pg-flex pg-flex-col pg-justify-between pg-h-full pg-min-h-[1500px]':
              $vuetify.breakpoint.mdAndUp
          }"
        >
          <div>
            <!-- Plan image -->
            <div
              class="pg-relative plan-image"
              :style="{ '--gradient-color': plan.color }"
            >
              <div class="text-over-image-container pg-px-3 pg-pb-6">
                <!-- Plan name -->
                <span class="text-over-image v2-font">
                  {{ plan.name }}
                </span>
              </div>

              <!-- Image -->
              <img
                class="pg-w-full"
                :src="plan.image"
                :alt="plan.name"
              />
            </div>

            <!-- Price -->
            <div
              class="pg-text-center pg-my-4 pg-px-4 pg-text-4xl pg-font-semibold v2-font"
              :style="{ color: plan.color }"
            >
              <template v-if="billBiannually">
                ${{ plan.priceBiannual.toFixed(2) }}
                <span class="pg-text-2xl">/semester</span>
              </template>
              <template v-else>
                ${{ plan.priceMonthly.toFixed(2) }}
                <span class="pg-text-2xl">/month</span>
              </template>
            </div>

            <!-- Subtitle -->
            <div
              class="pg-px-8 pg-py-1 pg-text-[#FFA0C8] pg-text-lg pg-text-center pg-font-medium v2-font"
            >
              Best for families that want: <br />
              {{ plan.commonBenefits.bestFor }}
            </div>

            <div
              class="pg-px-8 pg-py-1 pg-text-[#BA89EB] pg-text-lg pg-font-medium v2-font"
            >
              {{ plan.commonBenefits.title || "What's included:" }}
            </div>

            <!-- Description -->
            <plan-description class="pg-p-5" :plan="plan" :color="plan.color" />
          </div>

          <div class="pg-px-8 pg-py-6">
            <!-- Choose plan -->
            <v-btn
              outlined
              block
              :loading="loading"
              :color="plan.color"
              :disabled="planIsSelected(plan)"
              @click="doAction(plan)"
            >
              {{ !planIsSelected(plan) ? 'Choose plan' : 'Current Plan' }}
            </v-btn>

            <p v-if="isTrialing" class="pg-text-center pg-text-sm pg-mt-4">
              Playgarden Prep Online is COMPLETELY FREE for the first 15 days.
            </p>
          </div>
        </div>
      </v-col>

      <!-- CREDIT CARD MODAL -->
      <credit-card-modal
        v-model="isCreditCardModalVisible"
        @card-added="dataSubmitDialog"
      />
    </v-row>
  </div>

  <pg-loading v-else />
</template>

<script>
import {
  defineComponent,
  useStore,
  computed,
  useRoute, reactive
} from '@nuxtjs/composition-api'
import { mapActions, mapGetters } from 'vuex'

import submittable from '@/utils/mixins/submittable'

import {
  useAuth,
  useBilling,
  useGlobalModal,
  useNotification
} from '@/composables'

import { UserFlow } from '@/models'
import CreditCardModal from '@/components/app/payment/CreditCardModal.vue'
import isCreditCard from 'validator/es/lib/isCreditCard'
import PaymentInformationDialog from '../PaymentInformationDialog.vue'
import PlanDescription from './PlanDescription.vue'

export default defineComponent({
  name: 'SubscriptionPlanSelection',

  components: {
    CreditCardModal,
    PlanDescription,
    PaymentInformationDialog
  },

  mixins: [submittable],

  props: {
    userLoadPlan: {
      type: Number,
      default: undefined
    },

    inSignUpProcess: {
      type: Boolean,
      default: false
    },

    isTrialing: {
      type: Boolean,
      default: false
    },

    noAddress: Boolean,

    noPayment: Boolean,

    administrator: Boolean,

    updating: Boolean
  },

  setup() {
    const route = useRoute()
    const store = useStore()
    const { showContactUsModal } = useGlobalModal({ store })
    const { setIsTrialEndingPlanSelectedModalVisible } = useNotification({
      store
    })

    // @ts-ignore
    const isAnnualSubscriptionEnabled = computed(
      () => store.state.plans.isAnnualSubscriptionEnabled
    )

    const Auth = useAuth({ store })
    const Billing = useBilling()

    const fromPlaydates = computed(
      () => route.value.query.fromPlaydates === 'true'
    )

    return {
      Auth,
      Billing,
      fromPlaydates,
      showContactUsModal,
      isAnnualSubscriptionEnabled,
      setIsTrialEndingPlanSelectedModalVisible
    }
  },

  data: () => ({
    draftAddress: {},
    /** @type {import('@/models').Plan[]} */
    plans: [],
    selectedPlan: null,
    loading: false,
    initialized: false,
    isCreditCardModalVisible: false,
    billBiannually: false,
    paymentInfoDialog: false
  }),

  computed: {
    ...mapGetters('auth', ['isUserLoggedIn', 'getUserInfo'])
  },

  async created() {
    await this.fetchPlans()

    this.initialized = true
    this.$emit('initialized')

    if (this.isUserLoggedIn) {
      this.getPlan()
    }

    const planId = this.$route.query.planId
    const biannually = this.$route.query.biannually
    if (planId && biannually) {
      const plan = this.plans.find(plan => plan.id.toString() === planId)
      if (plan) {
        setTimeout(() => {
          this.openDialog(plan)
          this.billBiannually = biannually === 'yes'
        }, 1000)
      }
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

    planIsSelected(plan) {
      const type = this.billBiannually ? 'year' : 'month'
      if (!this.getUserInfo.accountCancelled) {
        return this.getUserInfo.planSelected.name === plan.name && this.getUserInfo.subscription.plan.interval === type
      }
      return false
    },

    doAction(plan) {
      if (this.inSignUpProcess) {
        this.onSubmit(plan)
      } else {
        this.openDialog(plan)
      }
    },

    openDialog(plan) {
      this.paymentInfoDialog = true
      this.selectedPlan = plan
    },

    getPlan() {
      try {
        this.disableAxiosGlobal()
        this.plans.forEach(({ id, plusBenefits, homeDeliveryBenefits }) => {
          this.draft = {
            id,
            type: this.isAnnualSubscriptionEnabled ? 'biannual' : 'monthly',
            requireAddress: Boolean(homeDeliveryBenefits || plusBenefits)
          }
        })

        this.billBiannually = this.isAnnualSubscriptionEnabled
      } catch (e) {
      } finally {
        this.enableAxiosGlobal()
      }
    },

    async fetchPlans() {
      try {
        this.plans = await this.fetchSubscriptionPlan()
      } catch (e) {}
    },

    onSubmit(plan) {
      this.selectedPlan = plan
      if (this.administrator) {
        const plan = this.getSubmittableData()
        plan.id = this.selectedPlan.id
        this.$emit('click:administrator', { planSelected: plan })
      } else {
        this.dataSubmitDialog()
      }
    },

    async dataSubmitDialog() {
      this.loading = true
      const plan = this.getSubmittableData()
      plan.id = this.selectedPlan.id
      plan.type = this.billBiannually ? 'biannual' : 'monthly'
      plan.fromPlaydates = this.fromPlaydates
      try {
        if (this.inSignUpProcess) {
          await this.selectSubscriptionPlan(plan)
          await this.Auth.fetchUserInfo()
          this.$emit('click:submit')
        } else {
          /**
           * If the user does not have a credit card and is in flow NO_CREDITCARD,
           * ask them to register a credit card.
           */
          if (this.Auth.userInfo.value.flow === UserFlow.NOCREDITCARD) {
            const userCards = await this.Billing.fetchBillingCards()

            if (userCards?.length === 0) {
              this.isCreditCardModalVisible = true
              this.loading = false
              return
            }
          }
          await this.selectSubscriptionPlan(plan)
          await this.Auth.fetchUserInfo()
          this.setIsTrialEndingPlanSelectedModalVisible(true)
          this.$nuxt.$emit('plan-membership-changed')

          this.$emit('click:submit', {
            draft: plan,
            draftAddress: this.draftAddress
          })
        }
      } catch (e) {
        this.$toast.error('Could not select plan. Please, try again later.')
      } finally {
        this.loading = false
      }
    },

    resetDraft() {
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

    planHasPromotions(plan) {
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

<style scoped lang="scss">
.card-shadow {
  box-shadow: 0px 3px 17px rgba(0, 0, 0, 0.25);
}

.text-over-image-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  width: 100%;
  height: calc(100% - 20px);
  color: white;
  font-weight: 600;
  letter-spacing: 1px;
}

.text-over-image {
  font-size: 36px;
  line-height: 40px;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: relative;

  @media (min-width: 960px) and (max-width: 1264px) {
    font-size: 24px;
    line-height: 32px;
  }
}

.plan-image {
  --gradient-color: transparent;
  &::before {
    background: linear-gradient(0deg, var(--gradient-color) 0%, transparent);
    content: '';
    width: 100%;
    height: 33%;
    display: block;
    position: absolute;
    bottom: 4px;
  }

  &::after {
    content: '';
    border: 4px solid var(--gradient-color);
    position: absolute;
    top: 20px;
    left: 20px;
    height: calc(100% - 40px);
    width: calc(100% - 40px);
  }
}

@media (min-width: 425px) and (max-width: 1023px) {
  .text-over-image {
    font-size: 48px;
    line-height: 1;
  }

  .text-over-image-container {
    padding-bottom: 56px;
  }
}
</style>
