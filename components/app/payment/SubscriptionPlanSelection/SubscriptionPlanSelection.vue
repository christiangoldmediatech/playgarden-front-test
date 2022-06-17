<template>
  <div v-if="initialized" class="pg-w-full">
    <!-- Bill monthly/anually switch -->
    <div class="pg-flex pg-justify-center">
      <div class="pg-flex pg-items-center">
        <span class="pg-mr-3 pg-text-xl pg-font-semibold">Bill Monthly</span>
        <v-switch v-model="billAnnually" color="#FFA0C8" inset />
        <span class="pg-text-xl pg-font-semibold">Bill Annually</span>
      </div>
    </div>

    <!-- Plan columns -->
    <v-row class="pg-w-[90%] pg-max-w-[1800px] pg-m-auto">
      <v-col
        v-for="(plan, i) in plans"
        :key="plan.name"
        cols="12"
        :md="Math.ceil(12 / plans.length)"
      >
        <div
          class="elevation-6 pg-rounded-md"
          :class="{
            'pg-flex pg-flex-col pg-justify-between pg-h-[1500px]':
              $vuetify.breakpoint.mdAndUp
          }"
        >
          <div>
            <!-- Image -->
            <v-img
              :src="require(`@/assets/png/plans/plan-${i}.png`)"
              :alt="plan.name"
              cover
              height="200"
              width="100%"
            />

            <!-- Price -->
            <div
              class="pg-text-center pg-my-6 pg-px-4 pg-text-3xl pg-font-semibold"
              :style="{ color: colors[i] }"
            >
              <template v-if="billAnnually">
                ${{ plan.priceAnnual.toFixed(2) }} /year
              </template>
              <template v-else>
                ${{ plan.priceMonthly.toFixed(2) }} /month
              </template>
            </div>

            <!-- Subtitle -->
            <div class="pg-px-8 pg-py-1 pg-text-[#FFA0C8]">
              {{
                plan.name === 'Play & Learn'
                  ? 'Weekly curated content for for 1-3 hrs of learning and well-being, including:'
                  : plan.name === 'Learning Kits'
                    ? 'Home Delivery of a custom Learning Kit that includes:'
                    : "What's included:"
              }}
            </div>

            <!-- Description -->
            <plan-description class="pg-p-4" :plan="plan" />
          </div>

          <div class="pg-px-4 pg-py-8">
            <!-- Coming soon -->
            <v-btn
              v-if="plan.name === 'Learning Kits'"
              outlined
              block
              :color="colors[i]"
            >
              Coming soon
            </v-btn>

            <!-- Call to enroll -->
            <div v-else-if="plan.name === 'Homeschool'" class="pg-text-center">
              <div class="accent--text pg-text-2xl pg-font-bold">
                Call to enroll
              </div>

              Limited availability
            </div>

            <!-- Try for free -->
            <v-btn
              v-else
              outlined
              block
              :color="colors[i]"
              @click="onSubmit(plan)"
            >
              Try for free
            </v-btn>
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
  useRoute
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
import PlanDescription from './PlanDescription.vue'

const colors = ['#C399ED', '#96D5DE', '#FAA938', '#B2E68D']

export default defineComponent({
  name: 'SubscriptionPlanSelection',

  components: {
    CreditCardModal: () =>
      import('@/components/app/payment/CreditCardModal.vue'),
    PlanDescription
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
      setIsTrialEndingPlanSelectedModalVisible,
      colors
    }
  },

  data: () => ({
    draftAddress: {},
    /** @type {import('@/models').Plan[]} */
    plans: [],
    selectedPlan: null,
    productPrice: 324,
    loading: false,
    initialized: false,
    bkgColor: '#BDDA9F',
    isCreditCardModalVisible: false,
    billAnnually: false
  }),

  computed: {
    ...mapGetters('auth', ['isUserLoggedIn'])
  },

  async created() {
    await this.fetchPlans()

    this.initialized = true
    this.$emit('initialized')

    if (this.isUserLoggedIn) {
      this.getPlan()
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

    getPlan() {
      try {
        this.disableAxiosGlobal()
        this.plans.forEach(({ id, plusBenefits, homeDeliveryBenefits }) => {
          this.draft = {
            id,
            type: this.isAnnualSubscriptionEnabled ? 'annual' : 'monthly',
            requireAddress: Boolean(homeDeliveryBenefits || plusBenefits)
          }
        })
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
      try {
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
        plan.fromPlaydates = this.fromPlaydates
        await this.selectSubscriptionPlan(plan)
        await this.Auth.fetchUserInfo()
        this.setIsTrialEndingPlanSelectedModalVisible(true)
        this.$nuxt.$emit('plan-membership-changed')
        this.$emit('click:submit', {
          draft: plan,
          draftAddress: this.draftAddress
        })
      } catch (e) {
        this.$snotify.error('Could not select plan. Please, try again later.')
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
