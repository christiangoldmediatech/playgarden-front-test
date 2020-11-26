<template>
  <div>
    <v-divider class="mb-3" />

    <v-radio
      :label="`$${plan.priceMonthly.toFixed(2).toLocaleString('en-US')} a month/child`"
      :value="plan.monthlyStripeId"
      @change="
        $emit('input', {
          id: plan.id,
          type: 'monthly',
          requireAddress: Boolean(
            plan.homeDeliveryBenefits || plan.plusBenefits
          )
        })
      "
    />

    <v-radio
      class="mb-0"
      :label="`$${((plan.priceAnnual/12)).toFixed(2).toLocaleString('en-US')} a month/child`"
      :value="plan.anualStripeId"
      @change="
        $emit('input', {
          id: plan.id,
          type: 'annual',
          requireAddress: Boolean(
            plan.homeDeliveryBenefits || plan.plusBenefits
          )
        })
      "
    />

    <small v-if="indexPlan <= 1" class="ml-8">Billed Annually (save 24%)</small>
    <small v-else class="ml-8">Billed Annually (save 20%)</small>
  </div>
</template>

<script>
export default {
  name: 'RadioSelectors',

  props: {
    plan: {
      type: Object,
      required: true
    },

    indexPlan: {
      type: Number,
      required: true
    },

    value: {
      type: Object,
      default: undefined
    }
  }
}
</script>
