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
import { useLanguageHelper } from '@/composables'

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

    const subtitle = computed(() => language.t('modals.technicalIssues.subtitle'))

    const baseMessage = computed<any>(() => {
      if (hasPreschoolPlan.value) {
        return language.t('modals.technicalIssues.baseMessageFirstAlt1') +
        `<span class="pg-text-[#78C383]"> ${discountAmount.value}% ${language.t('modals.technicalIssues.baseMessageFirstAlt2')}</span>` +
        language.t('modals.technicalIssues.baseMessageFirstAlt3') +
        `<span class="pg-text-[#78C383]"> ${language.t('modals.technicalIssues.baseMessageFirstAlt4', { price: discountedAmount.value })}</span>`
      } else if (hasPlayAndLearnLivePlan.value) {
        return language.t('modals.technicalIssues.baseMessageSecondAlt1') +
          `<span class="pg-text-[#78C383]"> ${discountAmount.value}% ${language.t('modals.technicalIssues.baseMessageSecondAlt2')}</span>` +
          language.t('modals.technicalIssues.baseMessageSecondAlt3') +
          `<span class="pg-text-[#78C383]"> ${language.t('modals.technicalIssues.baseMessageSecondAlt4', { price: discountedAmount.value })}</span>`
      } else {
        return language.t('modals.technicalIssues.baseMessageThirdAlt1') + '' +
          language.t('modals.technicalIssues.baseMessageThirdAlt2') +
          `<span class="pg-text-[#78C383]"> ${language.t('modals.technicalIssues.baseMessageThirdAlt3')}</span>`
      }
    })

    const confirmationBtnText = computed(() => {
      if (hasPreschoolPlan.value || hasPlayAndLearnLivePlan.value) {
        return language.t('modals.technicalIssues.confirmation1', { price: `${discountAmount.value}%` })
      } else {
        return language.t('modals.technicalIssues.confirmation2')
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
