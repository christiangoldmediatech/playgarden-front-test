<template>
  <div>
    <!-- Common benefits -->
    <template v-if="plan.commonBenefits.benefits.length > 0">
      <plan-benefit
        v-for="benefit in plan.commonBenefits.benefits"
        :key="benefit"
        :color="plan.color"
        :benefit="benefit"
      />
    </template>

    <!-- Home delivery benefits -->
    <template
      v-if="
        plan.homeDeliveryBenefits &&
          plan.homeDeliveryBenefits.benefits.length > 0
      "
    >
      <plan-benefit
        v-for="(benefit, i) in plan.homeDeliveryBenefits.benefits"
        :key="i"
        :benefit="benefit"
        :color="plan.color"
      />
    </template>

    <!-- Plus benefits -->
    <div
      v-if="plan.plusBenefits && plan.plusBenefits.benefits.length > 0"
      :style="{ '--plan-color': plan.color }"
      class="plus-benefits"
    >
      <div class="!pg-relative accent--text pg-mb-1 pg-mt-6 pg-text-lg pg-font-semibold">
        {{ $t('commonWords.and') }}
      </div>

      <plan-benefit
        v-for="benefit in plan.plusBenefits.benefits"
        :key="benefit"
        :benefit="benefit"
        :color="plan.color"
        class="!pg-relative"
        large
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { Plan } from '@/models'
import PlanBenefit from './PlanBenefit.vue'

export default defineComponent({
  name: 'PlanDescription',
  components: { PlanBenefit },
  props: {
    plan: {
      type: Object as PropType<Plan>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.plus-benefits {
  position: relative;

  &::before {
    position: absolute;
    content: '';
    background-color: var(--plan-color);
    height: calc(100% + 1.25rem);
    width: calc(100% + 1rem);
    opacity: 0.3;
    transform: rotate(-2.39deg);
    top: -0.5rem;
    left: -0.5rem;
  }
}
</style>
