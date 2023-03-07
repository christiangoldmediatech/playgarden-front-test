<template>
  <div>
    <base-cancellation-modal
      v-model="viewBaseModal"
      :loading="loading"
      :subtitle="subtitle"
      :confirmation-btn-text="confirmationBtnText"
      @confirmation="handleConfirmation"
    >
      <div>
        <p class="base-model-title mb-0" v-html="baseMessage"></p>
        <p>{{ data }}</p>
      </div>
    </base-cancellation-modal>

    <positive-cancellation-modal v-model="viewPositiveModal">
      <template>
        <p class="positive-message pg-text-[#78C383] pg-font-[700]">
          {{ positiveModalMessage }}
        </p>

        <p class="positive-message pg-text-[#707070] pg-font-[500]">
          Thanks for being a part of the Playgarden Online community!
        </p>
      </template>
    </positive-cancellation-modal>

    <negative-cancellation-modal
      v-model="viewNegativeModal"
      title="Sorry to see you go!"
    >
      <final-cancellation-message />
    </negative-cancellation-modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useStore, watch } from '@nuxtjs/composition-api'
import BaseCancellationModal from '@/components/app/payment/BaseCancellationModal.vue'
import PositiveCancellationModal from '@/components/app/payment/PositiveCancellationModal.vue'
import NegativeCancellationModal from '@/components/app/payment/NegativeCancellationModal.vue'
import FinalCancellationMessage from '@/components/app/payment/FinalCancellationMessage.vue'
import { TypedStore } from '@/models'
import { useCancellation, useSnotifyHelper } from '@/composables'
import { CancellationFlowEnum } from '@/enums/cancellation-flow.enum'

export default defineComponent({
  name: 'TechnicalIssuesCancellationModal',
  props: {
    value: {
      type: Boolean,
      default: false
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
    PositiveCancellationModal,
    NegativeCancellationModal,
    FinalCancellationMessage
  },
  emits: ['input', 'closeModal', 'reloadInformation'],
  setup(props, { emit }) {
    const store = useStore<TypedStore>()
    const snotify = useSnotifyHelper()
    const { applyDiscountCode, cancelSubscription } = useCancellation({ store, snotify })
    const loading = ref(false)
    const viewBaseModal = ref(false)
    const viewPositiveModal = ref(false)
    const viewNegativeModal = ref(false)
    const subscriptionCancelled = ref(false)
    const subtitle = computed(() => 'Let us know about the issues you\'ve been experiencing—we\'d love to fix them for you!')
    const latestCancellationReason = computed(() => store.getters['plans/getLatestCancellationReason'])

    const data = computed(() => JSON.stringify(latestCancellationReason.value))

    const hasPreschoolPlan = computed(
      () => !store.getters['auth/hasPlayAndLearnPlan']
    )
    const hasPlayAndLearnLivePlan = computed(
      () => store.getters['auth/hasPlayAndLearnLivePlan']
    )

    const discountCode = computed(() => {
      if (hasPreschoolPlan.value) {
        return 'HALFPRE3'
      } else if (hasPlayAndLearnLivePlan.value) {
        return '40PLIVE5'
      } else {
        return 'PLFOREVER'
      }
    })

    const discountAmount = computed(() => {
      if (hasPreschoolPlan.value) {
        return 50
      } else if (hasPlayAndLearnLivePlan.value) {
        return 40
      } else {
        return 40
      }
    })

    const discountedAmount = computed(() => {
      return ((discountAmount.value / 100) * props.planInfo.priceMonthly).toFixed(2)
    })

    const baseMessage = computed(() => {
      if (hasPreschoolPlan.value) {
        return 'We\'re sorry you are experiencing problems! Give us another chance and we\'ll provide a' +
        `<span class="pg-text-[#78C383]"> ${discountAmount.value}% off discount</span>` +
        '—That\'s' +
        `<span class="pg-text-[#78C383]"> only $${discountedAmount.value} for the next three months.</span>`
      } else if (hasPlayAndLearnLivePlan.value) {
        return 'We\'re sorry you are experiencing problems! Give us another chance and we\'ll provide a' +
          `<span class="pg-text-[#78C383]"> ${discountAmount.value}% off discount</span>` +
          '—That\'s' +
          `<span class="pg-text-[#78C383]"> only $${discountedAmount.value} for the next five months.</span>`
      } else {
        return 'We\'re sorry you are experiencing problems! Give us another chance and we\'ll provide a discount' +
          '—A' +
          '<span class="pg-text-[#78C383]"> Play & Learn membership for only $9.99/month, forever!</span>'
      }
    })

    const confirmationBtnText = computed(() => {
      if (hasPreschoolPlan.value || hasPlayAndLearnLivePlan.value) {
        return `YES, I WANT ${discountAmount.value}% OFF`
      } else {
        return 'YES, I WANT THIS DEAL'
      }
    })

    const positiveModalMessage = computed(() => {
      if (hasPreschoolPlan.value) {
        return 'Your 50% discount has been applied to your next 3 billing dates.'
      } else if (hasPlayAndLearnLivePlan.value) {
        return 'Your 40% discount has been applied to your next 5 billing dates.'
      } else {
        return 'Your discount has been applied to all future billing dates.'
      }
    })

    const startFlow = computed({
      get() {
        return props.value
      },
      set(val: boolean) {
        emit('input', val)
      }
    })

    watch(startFlow, async () => {
      if (startFlow.value) {
        if (latestCancellationReason.value?.cancellationFlow === CancellationFlowEnum.DISCOUNT) {
          await applySubscriptionCancellingLogic()
        } else {
          viewBaseModal.value = true
        }
      }
    })

    watch(viewNegativeModal, () => {
      // If the subscription was cancelled, the user information should be reloaded after closing the last modal
      if (!viewNegativeModal.value && subscriptionCancelled.value) {
        emit('reloadInformation')
      }
    })

    watch(viewPositiveModal, () => {
      if (!viewPositiveModal.value) {
        emit('reloadInformation')
      }
    })

    const handleConfirmation = async (data: { confirmation: boolean, explanation: string }) => {
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
          viewPositiveModal.value = true
        } else {
          await applySubscriptionCancellingLogic()
        }
      } catch {
        snotify.error('Could not process plan cancellation')
      } finally {
        loading.value = false
        viewBaseModal.value = false
        startFlow.value = false
      }
    }

    const applySubscriptionCancellingLogic = async () => {
      await cancelSubscription(props.reasonMessage)
      subscriptionCancelled.value = true
      viewNegativeModal.value = true
    }

    return {
      data,
      loading,
      viewBaseModal,
      viewPositiveModal,
      viewNegativeModal,
      baseMessage,
      confirmationBtnText,
      positiveModalMessage,
      subtitle,
      handleConfirmation
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
</style>
