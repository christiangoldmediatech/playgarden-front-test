<template>
  <div>
    <div class="my-3" />
    <!-- <v-divider class="mb-3" /> -->

    <v-radio
      :label="`$${plan.priceMonthly.toFixed(2).toLocaleString('en-US')} / Month`"
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
      :label="`$${((plan.priceAnnual/12)).toFixed(2).toLocaleString('en-US')} / Month`"
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

    <small v-if="indexPlan === 0" class="ml-8">Billed Annually (Save ~$170)</small>
    <small v-if="indexPlan === 1" class="ml-8">Billed Annually (Save ~$300)</small>
    <small v-if="indexPlan === 2" class="ml-8">Billed Annually (Save ~$1,200)</small>
    <br>
    <small class="ml-8">${{ plan.priceAnnual.toFixed(2).toLocaleString('en-US') }} / Year</small>
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
