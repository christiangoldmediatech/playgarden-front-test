<template>
  <div>
    <!-- Common benefits -->
    <template v-if="plan.commonBenefits.benefits.length > 0">
      <plan-benefit
        v-for="(benefit, i) in plan.commonBenefits.benefits"
        :key="i"
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
    <template v-if="plan.plusBenefits && plan.plusBenefits.benefits.length > 0">
      <div class="accent--text pg-ml-7 pg-my-4 pg-text-lg pg-font-semibold">
        AND
      </div>

      <plan-benefit
        v-for="(benefit, i) in plan.plusBenefits.benefits"
        :key="i"
        :benefit="benefit"
        :color="plan.color"
      />
    </template>
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
