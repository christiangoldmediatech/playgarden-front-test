<template>
  <div>
    <base-cancellation-modal
      v-model="viewBaseModal"
      :hide-input="inputInSecondStep"
      :explanation-required="explanationRequired"
      :explanation-min-length="explanationMinLength"
      :loading="loading"
      :subtitle="subtitle"
      :confirmation-btn-text="confirmationBtnText"
      @confirmation="handleBaseConfirmation"
      @resetFlow="resetFlow"
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
          {{ $t('modals.cancellationSteps.positive') }}
        </p>
      </template>
    </positive-cancellation-modal>

    <negative-cancellation-modal
      v-model="viewFirstNegativeModal"
      :hide-icon-and-title="hasDiscountBeenApplied"
      :title="$t('modals.negativeCancellation.firstTitle')"
    >
      <intermediate-cancellation-modal
        :loading="loading"
        :show-text-field="hasDiscountBeenApplied"
        @intermediateResponse="handleFirstIntermediateResponse"
      >
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
          {{ $t('modals.cancellationSteps.positive') }}
        </p>
      </template>
    </positive-cancellation-modal>

    <negative-cancellation-modal
      v-model="viewSecondNegativeModal"
      :title="$t('modals.negativeCancellation.firstTitle')"
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
          {{ $t('modals.cancellationSteps.positive') }}
        </p>
      </template>
    </positive-cancellation-modal>

    <negative-cancellation-modal
      v-model="viewThirdNegativeModal"
      :title="$t('modals.negativeCancellation.secondTitle')"
    >
      <final-cancellation-message />
    </negative-cancellation-modal>

    <credit-card-modal
      v-model="viewCreditCardModal"
      :back-button-text="$t('modals.creditCard.backBtn')"
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
import { useAuth, useBilling, useCancellation, useLanguageHelper, useToastHelper } from '@/composables'

export default defineComponent({
  name: 'CancellationSteps',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    explanationMinLength: {
      type: Number,
      default: 5
    },
    inputInSecondStep: {
      type: Boolean,
      default: false
    },
    cancelAfterFirstStep: {
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
    },
    isInTechnicalIssues: {
      type: Boolean,
      default: false
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
    const language = useLanguageHelper()
    const store = useStore<TypedStore>()
    const toast = useToastHelper()
    const auth = useAuth({ store })
    const billing = useBilling()
    const {
      hasDiscountFlowBeenUsed,
      applyDiscountCode,
      cancelSubscription,
      changeSubscription
    } = useCancellation({ store, toast })

    const loading = ref(false)
    const hasDiscountBeenApplied = ref(false)
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

    const cancellationExplanation = ref('')

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
        return language.t('modals.positiveCancellation.firstMessageFirstAlt')
      } else if (hasPlayAndLearnLivePlan.value) {
        return language.t('modals.positiveCancellation.firstMessageSecondAlt')
      } else {
        return language.t('modals.positiveCancellation.firstMessageThirdAlt')
      }
    })

    const secondPositiveModalMessage = computed(() => {
      if (hasPreschoolPlan.value) {
        return language.t('modals.positiveCancellation.secondMessageFirstAlt')
      } else if (hasPlayAndLearnLivePlan.value) {
        return language.t('modals.positiveCancellation.secondMessageSecondAlt')
      }
    })

    const thirdPositiveModalMessage = computed(() => {
      return language.t('modals.positiveCancellation.thirdMessage')
    })

    const firstNegativeModalMessage = computed(() => {
      if (hasPreschoolPlan.value) {
        return language.t('modals.negativeCancellation.firstMessageFirstAltPart1') + ' ' +
          `<span class="pg-text-[#78C383]">${language.t('modals.negativeCancellation.firstMessageFirstAltPart2')} </span>` +
          language.t('modals.negativeCancellation.firstMessageFirstAltPart3') + ' ' +
          `<span class="pg-text-[#78C383]">${language.t('modals.negativeCancellation.firstMessageFirstAltPart4')}</span>, ` +
          language.t('modals.negativeCancellation.firstMessageFirstAltPart5') + ' <br />' +
          `<span class="pg-text-[#F89838]">${language.t('modals.negativeCancellation.firstMessageFirstAltPart6')}</span>`
      } else if (hasPlayAndLearnLivePlan.value) {
        return language.t('modals.negativeCancellation.firstMessageSecondAltPart1') + ' ' +
          `<span class="pg-text-[#AAD579]">${language.t('modals.negativeCancellation.firstMessageSecondAltPart2')}</span>` +
          language.t('modals.negativeCancellation.firstMessageSecondAltPart3') + ' ' +
          `<span class="pg-text-[#AAD579]">${language.t('modals.negativeCancellation.firstMessageSecondAltPart4')} </span>` +
          language.t('modals.negativeCancellation.firstMessageSecondAltPart5') + ' <br />' +
          `<span class="pg-text-[#359846]">${language.t('modals.negativeCancellation.firstMessageSecondAltPart6')}</span>`
      }
    })

    const secondNegativeModalMessage = computed(() => {
      return language.t('modals.negativeCancellation.secondMessageFirstAltPart1') + ' ' +
          `<span class="pg-text-[#AAD579]">${language.t('modals.negativeCancellation.secondMessageFirstAltPart2')}</span>` +
          language.t('modals.negativeCancellation.secondMessageFirstAltPart3') + ' ' +
          `<span class="pg-text-[#AAD579]">${language.t('modals.negativeCancellation.secondMessageFirstAltPart4')} </span>` +
          language.t('modals.negativeCancellation.secondMessageFirstAltPart5') + ' <br />' +
          `<span class="pg-text-[#359846]">${language.t('modals.negativeCancellation.secondMessageFirstAltPart6')}</span>`
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
        console.log('starting flow')
        if (hasDiscountFlowBeenUsed.value) {
          hasDiscountBeenApplied.value = true
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
        if (data.explanation) {
          cancellationExplanation.value = data.explanation
        }

        if (props.cancelAfterFirstStep) {
          viewBaseModal.value = true

          if (data.confirmation) {
            await applyDiscountCode(discountCode.value, props.reasonMessage, cancellationExplanation.value)
            viewFirstPositiveModal.value = true
          } else {
            await applySubscriptionCancelLogic()
          }

          return
        }

        if (data.confirmation) {
          await applyDiscountCode(discountCode.value, props.reasonMessage, cancellationExplanation.value)
          viewFirstPositiveModal.value = true
        } else if (hasBasicPlayAndLearnPlan.value) {
          await applySubscriptionCancelLogic()
        } else {
          viewFirstNegativeModal.value = true
        }
      } catch {
        toast.error(language.t('modals.cancellationSteps.error1'))
      } finally {
        loading.value = false
        viewBaseModal.value = false
        startFlow.value = false
      }
    }

    const handleLastAction = async (data: { confirmation: boolean, explanation: string }) => {
      loading.value = true

      try {
        if (data.explanation) {
          cancellationExplanation.value = data.explanation
        }

        await applySubscriptionCancelLogic(false)
      } catch {
        toast.error(language.t('modals.cancellationSteps.error2'))
      } finally {
        loading.value = false
        viewBaseModal.value = false
        viewLastModal.value = false
        startFlow.value = false
        emit('reloadInformation', true)
      }
    }

    const handleFirstIntermediateResponse = async (data: { confirmation: boolean, explanation: string }) => {
      loading.value = true
      try {
        if (data.explanation) {
          cancellationExplanation.value = data.explanation
        }

        if (data.confirmation) {
          const success = await tryToChangeSubscription()

          if (!success) {
            stepWhenViewingCreditCardModal.value = 1
            return
          }

          viewSecondPositiveModal.value = true
        } else if (hasPreschoolPlan.value && !props.isInTechnicalIssues) {
          viewSecondNegativeModal.value = true
        } else if (hasPreschoolPlan.value && props.isInTechnicalIssues) {
          await applySubscriptionCancelLogic()
        } else if (hasPlayAndLearnLivePlan.value) {
          await applySubscriptionCancelLogic()
        }
      } catch {
        toast.error(language.t('modals.cancellationSteps.error2'))
      } finally {
        loading.value = false
        viewFirstNegativeModal.value = false
      }
    }

    const handleSecondIntermediateResponse = async (data: { confirmation: boolean, explanation: string }) => {
      loading.value = true
      try {
        if (data.confirmation) {
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
        toast.error(language.t('modals.cancellationSteps.error2'))
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

    const applySubscriptionCancelLogic = async (showLastModal = true) => {
      await cancelSubscription(props.reasonMessage, cancellationExplanation.value)
      subscriptionCancelled.value = true

      if (showLastModal) {
        viewThirdNegativeModal.value = true
      }
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

        await changeSubscription(planId, isBillingMonthly.value, props.reasonMessage, cancellationExplanation.value)

        return true
      } catch {
        toast.error(language.t('modals.cancellationSteps.error3'))
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

    const resetFlow = () => {
      startFlow.value = false
      viewBaseModal.value = false
      viewLastModal.value = false
      viewFirstPositiveModal.value = false
      viewFirstNegativeModal.value = false
      viewSecondPositiveModal.value = false
      viewSecondNegativeModal.value = false
      viewThirdPositiveModal.value = false
      viewThirdNegativeModal.value = false
    }

    return {
      loading,
      hasDiscountBeenApplied,
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
      handleSecondIntermediateResponse,
      resetFlow
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
