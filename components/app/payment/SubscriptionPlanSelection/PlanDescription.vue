<template>
  <div>
    <ul v-if="indexPlan === 0">
      <li
        v-for="(benefit, indexPCB) in plan.commonBenefits.benefits"
        :key="indexPCB"
        class="plan-item"
      >
        {{ benefit }}
      </li>
    </ul>
    <template v-if="plan.homeDeliveryBenefits && indexPlan === 1">
      <section class="font-weight-bold mt-3">
        Home Delivery of:
      </section>

      <ul>
        <li
          v-for="(benefit, indexHDB) in plan.homeDeliveryBenefits.benefits"
          :key="indexHDB"
          class="plan-item"
        >
          {{ benefit }}
        </li>
      </ul>
    </template>

    <template v-if="plan.plusBenefits">
      <section class="font-weight-bold mt-3">
        Plus:
      </section>

      <ul>
        <li
          v-for="(benefit, indexPB) in plan.plusBenefits.benefits"
          :key="indexPB"
          class="plan-item"
        >
          {{ benefit }}
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
export default {
  name: 'PlanDescription',

  props: {
    plan: {
      type: Object,
      required: true
    },
    indexPlan: {
      type: Number,
      required: true
    }
  },

  computed: {
    getCommonBenefits () {
      return this.plan.commonBenefits.benefits.slice(0, 1)
    }
  }
}
</script>

<style scoped>
ul {
  list-style: none; /* Remove default bullets */
}

ul li::before {
  content: "✔";
  color: var(--v-primary-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 1em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
}
</style>
