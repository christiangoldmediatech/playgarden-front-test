<template>
  <div>
    <cancellation-steps
      v-model="startFlow"
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
import { useLanguageHelper } from '@/composables'

export default defineComponent({
  name: 'GoingToInPersonModal',
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
    const language = useLanguageHelper()
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

    const subtitle = computed(() => language.t('modals.goingToInPerson.subtitle'))

    const baseMessage = computed<any>(() => {
      if (hasPreschoolPlan.value) {
        return language.t('modals.goingToInPerson.baseMessageFirstAlt1') +
        `<span class="pg-text-[#78C383]"> ${discountAmount.value}% ${language.t('modals.goingToInPerson.baseMessageFirstAlt2')}</span>` +
        language.t('modals.goingToInPerson.baseMessageFirstAlt3') +
        `<span class="pg-text-[#78C383]"> ${language.t('modals.goingToInPerson.baseMessageFirstAlt4', { price: discountedAmount.value })}</span>`
      } else if (hasPlayAndLearnLivePlan.value) {
        return language.t('modals.goingToInPerson.baseMessageSecondAlt1') +
          `<span class="pg-text-[#78C383]"> ${discountAmount.value}% ${language.t('modals.goingToInPerson.baseMessageSecondAlt2')}</span>` +
          language.t('modals.goingToInPerson.baseMessageSecondAlt3') +
          `<span class="pg-text-[#78C383]"> ${language.t('modals.goingToInPerson.baseMessageSecondAlt4', { price: discountedAmount.value })}</span>`
      } else {
        return language.t('modals.goingToInPerson.baseMessageThirdAlt1') + '' +
          language.t('modals.goingToInPerson.baseMessageThirdAlt2') +
          `<span class="pg-text-[#78C383]"> ${language.t('modals.goingToInPerson.baseMessageThirdAlt3')}</span>`
      }
    })

    const confirmationBtnText = computed(() => {
      if (hasPreschoolPlan.value || hasPlayAndLearnLivePlan.value) {
        return language.t('modals.goingToInPerson.confirmation1', { price: `${discountAmount.value}%` })
      } else {
        return language.t('modals.goingToInPerson.confirmation2')
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
