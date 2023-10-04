<template>
  <div>
    <cancellation-steps
      v-model="startFlow"
      :input-in-second-step=" true"
      :base-message="baseMessage"
      :subtitle="subtitle"
      :confirmation-btn-text="confirmationBtnText"
      :plan="plan"
      :plan-info="planInfo"
      :reason-message="reasonMessage"
      :billing-type="billingType"
      @reloadInformation="$emit('reloadInformation', $event)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import CancellationSteps from '@/components/app/payment/CancellationSteps.vue'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'LittleOneNotEngagedModal',
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

    const subtitle = computed(() => 'We\'re always looking to improve! What could we do to increase engagement with your little one?')

    const baseMessage = computed(() => {
      if (hasPreschoolPlan.value) {
        return 'We\'re sorry to see you go! Have you tried our LIVE Zoom lessons where your little one can engage in real time with our teachers? Give us another chance and we\'ll provide a ' +
          `<span class="pg-text-[#78C383]">${discountAmount.value}% off discount</span>` +
          '—That\'s ' +
          `<span class="pg-text-[#78C383]">only $${discountedAmount.value} for the next three months.</span>`
      } else if (hasPlayAndLearnLivePlan.value) {
        return 'We\'re sorry to see you go! Have you tried our LIVE Zoom lessons where your little one can engage in real time with our teachers? Give us another chance and we\'ll provide a ' +
          `<span class="pg-text-[#78C383]">${discountAmount.value}% off discount </span>` +
          '—That\'s ' +
          `<span class="pg-text-[#78C383]">only $${discountedAmount.value} for the next five months.</span>`
      } else {
        return 'We\'re sorry to see you go! Give us another chance and we\'ll provide a discount—' +
        '<span class="pg-text-[#78C383]">A Play & Learn membership for only $9.99/month, forever!</span>'
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
