<template>
  <div>
    <v-divider class="my-3" />

    <v-radio
      :label="`$${plan.priceMonthly} a month/child`"
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
      :label="`$${plan.priceAnnual} School Year Special/child`"
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

    <small class="ml-8">(10 months)</small>
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

    value: {
      type: Object,
      default: undefined
    }
  }
}
</script>
