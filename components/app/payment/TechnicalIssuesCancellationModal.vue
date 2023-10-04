<template>
  <cancellation-steps
    v-model="startFlow"
    :input-in-second-step=" true"
    :cancel-after-first-step="true"
    :base-message="baseMessage"
    :subtitle="subtitle"
    :confirmation-btn-text="confirmationBtnText"
    :plan="plan"
    :plan-info="planInfo"
    :is-in-technical-issues="true"
    :reason-message="reasonMessage"
    :billing-type="billingType"
    @reloadInformation="$emit('reloadInformation', $event)"
  />
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import CancellationSteps from '@/components/app/payment/CancellationSteps.vue'
import { TypedStore } from '@/models'

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
    CancellationSteps
  },
  emits: ['input', 'closeModal', 'reloadInformation'],
  setup(props, { emit }) {
    const store = useStore<TypedStore>()

    const startFlow = computed({
      get() {
        return props.value
      },
      set(val: boolean) {
        emit('input', val)
      }
    })

    const hasPreschoolPlan = computed(
      () => !store.getters['auth/hasPlayAndLearnPlan']
    )
    const hasPlayAndLearnLivePlan = computed(
      () => store.getters['auth/hasPlayAndLearnLivePlan']
    )

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

    const subtitle = computed(() => 'Let us know about the issues you\'ve been experiencing—we\'d love to fix them for you!')

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

    return {
      startFlow,
      subtitle,
      baseMessage,
      confirmationBtnText
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
