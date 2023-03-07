<template>
  <div>
    <base-cancellation-modal
      v-model="viewBaseModal"
      :explanation-required="explanationRequired"
      :loading="loading"
      :subtitle="subtitle"
      :confirmation-btn-text="confirmationBtnText"
      @confirmation="handleBaseConfirmation"
    >
      <p class="base-model-title mb-0" v-html="baseMessage"></p>
    </base-cancellation-modal>

    <last-modal
      v-model="viewLastModal"
      :explanation-required="true"
      :loading="loading"
      @confirmation="handleLastAction"
    />

    <!-- First step -->
    <positive-cancellation-modal v-model="viewFirstPositiveModal">
      <template>
        <p class="positive-message pg-text-[#78C383] pg-font-[700]">
          {{ firstPositiveModalMessage }}
        </p>

        <p class="positive-message pg-text-[#707070] pg-font-[500]">
          Thanks for being a part of the Playgarden Online community!
        </p>
      </template>
    </positive-cancellation-modal>

    <negative-cancellation-modal
      v-model="viewFirstNegativeModal"
      title="Are you sure?"
    >
      <intermediate-cancellation-modal :loading="loading" @intermediateResponse="handleFirstIntermediateResponse">
        <p class="intermediate-message" v-html="firstNegativeModalMessage"></p>
      </intermediate-cancellation-modal>
    </negative-cancellation-modal>

    <!-- Second step -->
    <positive-cancellation-modal v-model="viewSecondPositiveModal">
      <template>
        <p class="positive-message pg-text-[#707070] pg-font-[500]">
          {{ secondPositiveModalMessage }}
        </p>

        <p class="positive-message pg-text-[#707070] pg-font-[500]">
          Thanks for being a part of the Playgarden Online community!
        </p>
      </template>
    </positive-cancellation-modal>

    <negative-cancellation-modal
      v-model="viewSecondNegativeModal"
      title="Are you sure?"
    >
      <intermediate-cancellation-modal :loading="loading" @intermediateResponse="handleSecondIntermediateResponse">
        <p class="intermediate-message" v-html="secondNegativeModalMessage"></p>
      </intermediate-cancellation-modal>
    </negative-cancellation-modal>

    <!-- Third step -->
    <positive-cancellation-modal v-model="viewThirdPositiveModal">
      <template>
        <p class="positive-message pg-text-[#707070] pg-font-[500]">
          {{ thirdPositiveModalMessage }}
        </p>

        <p class="positive-message pg-text-[#707070] pg-font-[500]">
          Thanks for being a part of the Playgarden Online community!
        </p>
      </template>
    </positive-cancellation-modal>

    <negative-cancellation-modal
      v-model="viewThirdNegativeModal"
      title="Sorry to see you go!"
    >
      <final-cancellation-message />
    </negative-cancellation-modal>

    <credit-card-modal
      v-model="viewCreditCardModal"
      @card-added="retryFailedSubscriptionChange"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useStore, watch } from '@nuxtjs/composition-api'
import BaseCancellationModal from '@/components/app/payment/BaseCancellationModal.vue'
import LastModal from '@/components/app/payment/LastModal.vue'
import PositiveCancellationModal from '@/components/app/payment/PositiveCancellationModal.vue'
import NegativeCancellationModal from '@/components/app/payment/NegativeCancellationModal.vue'
import IntermediateCancellationModal from '@/components/app/payment/IntermediateCancellationModal.vue'
import FinalCancellationMessage from '@/components/app/payment/FinalCancellationMessage.vue'
import CreditCardModal from '@/components/app/payment/CreditCardModal.vue'
import { PlanTier, TypedStore, UserFlow } from '@/models'
import { useAuth, useBilling, useCancellation, useSnotifyHelper } from '@/composables'
import { CancellationFlowEnum } from '@/enums/cancellation-flow.enum'

export default defineComponent({
  name: 'CancellationSteps',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    explanationRequired: {
      type: Boolean,
      default: false
    },
    baseMessage: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    confirmationBtnText: {
      type: String,
      default: ''
    },
    plan: {
      type: Object,
      required: true
    },
    planInfo: {
      type: Object,
      required: true
    },
    reasonMessage: {
      type: String,
      default: ''
    },
    billingType: {
      type: String,
      default: ''
    }
  },
  components: {
    BaseCancellationModal,
    LastModal,
    PositiveCancellationModal,
    NegativeCancellationModal,
    IntermediateCancellationModal,
    CreditCardModal,
    FinalCancellationMessage
  },
  emits: ['input', 'closeModal', 'reloadInformation'],
  setup(props, { emit }) {
    const store = useStore<TypedStore>()
    const snotify = useSnotifyHelper()
    const auth = useAuth({ store })
    const billing = useBilling()
    const {
      applyDiscountCode,
      cancelSubscription,
      changeSubscription
    } = useCancellation({ store, snotify })

    const loading = ref(false)
    const viewBaseModal = ref(false)
    const viewLastModal = ref(false)
    const viewFirstPositiveModal = ref(false)
    const viewFirstNegativeModal = ref(false)
    const viewSecondPositiveModal = ref(false)
    const viewSecondNegativeModal = ref(false)
    const viewThirdPositiveModal = ref(false)
    const viewThirdNegativeModal = ref(false)
    const subscriptionCancelled = ref(false)
    const viewCreditCardModal = ref(false)
    const stepWhenViewingCreditCardModal = ref(0)
    const latestCancellationReason = computed(() => store.getters['plans/getLatestCancellationReason'])

    const data = computed(() => JSON.stringify(latestCancellationReason.value))

    const hasPreschoolPlan = computed(
      () => !store.getters['auth/hasPlayAndLearnPlan']
    )
    const hasPlayAndLearnLivePlan = computed(
      () => store.getters['auth/hasPlayAndLearnLivePlan']
    )
    const hasBasicPlayAndLearnPlan = computed(
      () => store.getters['auth/hasBasicPlayAndLearnPlan']
    )

    const isBillingMonthly = computed(() => props.billingType === 'MONTHLY')

    const discountCode = computed(() => {
      if (hasPreschoolPlan.value) {
        return 'HALFPRE3'
      } else if (hasPlayAndLearnLivePlan.value) {
        return '40PLIVE5'
      } else {
        return 'PLFOREVER'
      }
    })

    const firstPositiveModalMessage = computed(() => {
      if (hasPreschoolPlan.value) {
        return 'Your 50% discount has been applied to your next 3 billing dates.'
      } else if (hasPlayAndLearnLivePlan.value) {
        return 'Your 40% discount has been applied to your next 5 billing dates.'
      } else {
        return 'Your discount has been applied to all future billing dates.'
      }
    })

    const secondPositiveModalMessage = computed(() => {
      if (hasPreschoolPlan.value) {
        return 'Your 15 day free trial of Play & Learn LIVE starts now.'
      } else if (hasPlayAndLearnLivePlan.value) {
        return 'Your 15 day free trial of Play & Learn starts now.'
      }
    })

    const thirdPositiveModalMessage = computed(() => {
      return 'Your 15 day free trial of Play & Learn starts now.'
    })

    const firstNegativeModalMessage = computed(() => {
      if (hasPreschoolPlan.value) {
        return 'Do you know about our ' +
          '<span class="pg-text-[#78C383]">Play & Learn LIVE </span>' +
          'Program? For ' +
          '<span class="pg-text-[#78C383]">only $39.99/month</span>, ' +
          'you get even more engaging learning videos, well-being content, and UNLIMITED live classes—for a value of only $3 per class! <br />' +
          '<span class="pg-text-[#F89838]">Do you want to try Play & Learn LIVE for free for 15 days?</span>'
      } else if (hasPlayAndLearnLivePlan.value) {
        return 'For only ' +
          '<span class="pg-text-[#AAD579]">$15.99/month</span>' +
          ', our ' +
          '<span class="pg-text-[#AAD579]">Play & Learn </span>' +
          'program includes our full video library with over 1000 educational videos by real teachers, Well-Being content, and engaging music playlists, and more! <br />' +
          '<span class="pg-text-[#359846]">Do you want to try Play & Learn for free for 15 days?</span>'
      }
    })

    const secondNegativeModalMessage = computed(() => {
      return 'For only ' +
          '<span class="pg-text-[#AAD579]">$15.99/month</span>' +
          ', our ' +
          '<span class="pg-text-[#AAD579]">Play & Learn </span>' +
          'program includes our full video library with over 1000 educational videos by real teachers, Well-Being content, and engaging music playlists, and more! <br />' +
          '<span class="pg-text-[#359846]">Do you want to try Play & Learn for free for 15 days?</span>'
    })

    const startFlow = computed({
      get() {
        return props.value
      },
      set(val: boolean) {
        emit('input', val)
      }
    })

    watch(startFlow, () => {
      if (startFlow.value) {
        if (latestCancellationReason.value?.cancellationFlow === CancellationFlowEnum.DISCOUNT) {
          if (hasPreschoolPlan.value || hasPlayAndLearnLivePlan.value) {
            viewFirstNegativeModal.value = true
          } else {
            viewLastModal.value = true
          }
        } else {
          viewBaseModal.value = true
        }
      }
    })

    watch(viewThirdNegativeModal, () => {
      // If the subscription was cancelled, the user information should be reloaded after closing the last modal
      if (!viewThirdNegativeModal.value && subscriptionCancelled.value) {
        emit('reloadInformation')
      }
    })

    watch(viewFirstPositiveModal, () => {
      if (!viewFirstPositiveModal.value) {
        emit('reloadInformation', true)
      }
    })

    watch(viewSecondPositiveModal, () => {
      if (!viewSecondPositiveModal.value) {
        emit('reloadInformation', true)
      }
    })

    watch(viewThirdPositiveModal, () => {
      if (!viewThirdPositiveModal.value) {
        emit('reloadInformation', true)
      }
    })

    const handleBaseConfirmation = async (data: { confirmation: boolean, explanation: string }) => {
      loading.value = true

      try {
        await store.dispatch(
          'plans/recordCancelPlanReason',
          {
            reason: props.reasonMessage,
            explanation: data.explanation,
            planId: props.plan?.id
          }
        )

        if (data.confirmation) {
          await applyDiscountCode(discountCode.value)
          viewFirstPositiveModal.value = true
        } else if (hasBasicPlayAndLearnPlan.value) {
          await applySubscriptionCancelLogic()
        } else {
          viewFirstNegativeModal.value = true
        }
      } catch {
        snotify.error('Could not process plan cancellation')
      } finally {
        loading.value = false
        viewBaseModal.value = false
        startFlow.value = false
      }
    }

    const handleLastAction = async (data: { confirmation: boolean, explanation: string }) => {
      loading.value = true

      try {
        await store.dispatch(
          'plans/recordCancelPlanReason',
          {
            reason: props.reasonMessage,
            explanation: data.explanation,
            planId: props.plan?.id
          }
        )

        await applySubscriptionCancelLogic()
      } catch {
        snotify.error('Could not process plan cancellation')
      } finally {
        loading.value = false
        viewLastModal.value = false
        startFlow.value = false
      }
    }

    const handleFirstIntermediateResponse = async (accept: boolean) => {
      loading.value = true
      try {
        if (accept) {
          const success = await tryToChangeSubscription()

          if (!success) {
            stepWhenViewingCreditCardModal.value = 1
            return
          }

          viewSecondPositiveModal.value = true
        } else if (hasPreschoolPlan.value) {
          viewSecondNegativeModal.value = true
        } else if (hasPlayAndLearnLivePlan.value) {
          await applySubscriptionCancelLogic()
        }
      } catch {
        snotify.error('Something went wrong')
      } finally {
        loading.value = false
        viewFirstNegativeModal.value = false
      }
    }

    const handleSecondIntermediateResponse = async (accept: boolean) => {
      loading.value = true
      try {
        if (accept) {
          const success = await tryToChangeSubscription()

          if (!success) {
            stepWhenViewingCreditCardModal.value = 2
            return
          }

          viewThirdPositiveModal.value = true
        } else {
          await applySubscriptionCancelLogic()
        }
      } catch {
        snotify.error('Something went wrong')
      } finally {
        loading.value = false
        viewSecondNegativeModal.value = false
      }
    }

    const shouldRequiredUserCard = async () => {
      if (auth.userInfo.value.flow === UserFlow.NOCREDITCARD) {
        const userCards = await billing.fetchBillingCards()

        return userCards?.length === 0
      }

      return false
    }

    const applySubscriptionCancelLogic = async () => {
      await cancelSubscription(props.reasonMessage)
      subscriptionCancelled.value = true
      viewThirdNegativeModal.value = true
    }

    const getSelectedPlanId = () => {
      if (viewFirstNegativeModal.value) {
        return hasPreschoolPlan.value ? PlanTier.PLAY_AND_LEARN_LIVE : PlanTier.PLAY_AND_LEARN
      }

      return PlanTier.PLAY_AND_LEARN
    }

    const tryToChangeSubscription = async (): Promise<boolean> => {
      // Returns true if succeeded changing plan
      try {
        const planId = getSelectedPlanId()

        // const askForCard = await shouldRequiredUserCard()
        // if (askForCard) {
        //   viewCreditCardModal.value = true
        //   return false
        // }

        await changeSubscription(planId, isBillingMonthly.value)

        return true
      } catch {
        snotify.error('Could not change subscription plan')
        return false
      }
    }

    const retryFailedSubscriptionChange = async () => {
      viewCreditCardModal.value = false

      if (stepWhenViewingCreditCardModal.value === 1) {
        viewFirstNegativeModal.value = true
      } else if (stepWhenViewingCreditCardModal.value === 2) {
        viewFirstNegativeModal.value = true
      }

      loading.value = true

      await tryToChangeSubscription()

      loading.value = false

      if (stepWhenViewingCreditCardModal.value === 1) {
        viewFirstNegativeModal.value = false
        viewSecondPositiveModal.value = true
      } else if (stepWhenViewingCreditCardModal.value === 2) {
        viewFirstNegativeModal.value = false
        viewThirdPositiveModal.value = true
      }
    }

    return {
      loading,
      data,
      viewBaseModal,
      viewLastModal,
      viewFirstPositiveModal,
      viewFirstNegativeModal,
      viewSecondPositiveModal,
      viewSecondNegativeModal,
      viewThirdPositiveModal,
      viewThirdNegativeModal,
      viewCreditCardModal,
      firstPositiveModalMessage,
      secondPositiveModalMessage,
      thirdPositiveModalMessage,
      firstNegativeModalMessage,
      secondNegativeModalMessage,
      tryToChangeSubscription,
      retryFailedSubscriptionChange,
      handleBaseConfirmation,
      handleLastAction,
      handleFirstIntermediateResponse,
      handleSecondIntermediateResponse
    }
  }
})
</script>

<style lang="scss" scoped>
.base-model-title {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 25px;
  text-align: center;
  text-transform: capitalize;
  color: #707070;
}

.positive-message {
  font-family: 'Quicksand';
  font-style: normal;
  font-size: 20px;
  text-align: center;
}

.intermediate-message {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  text-align: center;
  color: #707070;
}
</style>
