<template>
  <div class="plan-description">
    <!-- Common Benefits -->
    <ul class="plan-detail">
      <li
        v-for="(benefit, indexPCB) in plan.commonBenefits.benefits"
        :key="indexPCB"
        class="plan-item"
      >
        <span>
          {{ benefit }}
        </span>
      </li>
    </ul>

    <!-- Home Delivery Benefits -->
    <template v-if="plan.homeDeliveryBenefits">
      <ul class="plan-detail">
        <li
          v-for="(benefit, indexHDB) in plan.homeDeliveryBenefits.benefits"
          :key="indexHDB"
          class="plan-item"
        >
          <span>
            {{ benefit }}
          </span>
        </li>
      </ul>

      <!-- Promotions -->
      <template v-if="showPromotions && hasPromotions(plan.homeDeliveryBenefits.promotions)">
        <div class="promotion-ribbon pa-3 mx-n16 mr-3 my-6 text-center">
          <span class="font-weight-bold">* Join now and you will get this benefits:</span>
        </div>
        <ul class="plan-detail">
          <li
            v-for="(benefit, indexHDBP) in plan.homeDeliveryBenefits.promotions"
            :key="indexHDBP"
            class="plan-item"
          >
            <span>
              {{ benefit }}
            </span>
          </li>
        </ul>
      </template>
    </template>

    <!-- Introductory Promotions -->
    <template v-if="showPromotions && Boolean(promotions.length)">
      <div class="promotion-ribbon pa-3 mx-n16 my-6 text-center">
        <span class="font-weight-bold">**Introductory Promotion**</span>
      </div>
      <ul class="plan-detail">
        <li
          v-for="(benefit, indexHDBP) in promotions"
          :key="`introductory-promotion-${indexHDBP}`"
          class="plan-item"
        >
          <span>
            {{ benefit }}
          </span>
        </li>
      </ul>
    </template>

    <!-- Plus Benefits -->
    <template v-if="plan.plusBenefits">
      <ul class="plan-detail">
        <li
          v-for="(benefit, indexHDB) in plan.plusBenefits.benefits"
          :key="indexHDB"
          class="plan-item"
        >
          <span>
            {{ benefit }}
          </span>
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
    showPromotions: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    promotions () {
      return this.plan.commonBenefits.promotions || []
    }
  },

  methods: {
    hasPromotions (promotions) {
      return Array.isArray(promotions) && promotions.length > 0
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none; /* Remove default bullets */
}

ul li::before {
  content: "";
  background-color: var(--v-accent-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  position: relative;
  top: 0.5em;
  width: 1em; /* Also needed for space (tweak if needed) */
  height: 1em; /* Also needed for space (tweak if needed) */
  margin-left: -1.4rem; /* Also needed for space (tweak if needed) */
  margin-right: 0.5rem;
  border-radius: 0.5em;
}

.plan-detail li {
  width: 97%;
  line-height: 1.5;
  /*border: 1px blue solid; */
}
.plan-detail li span {
  display: -moz-inline-box;  /* FF2 or lower */
  display: initial;     /* FF3, Opera, Safari */
  line-height: 1.5;
  vertical-align: text-top;
  color: var(--v-black-base);
}

.plan-detail li span{
  *display: inline;
} /* haslayout for IE6/7 */
.plan-description {
  min-height: 155px !important;
}
.plan-item {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  margin-bottom: 12px;
  position: relative;
  span {
    position: relative;
    top: 4px;
  }
}
.promotion-ribbon {
  font-size: 20px;
  color: var(--v-accent-base);
  background: rgba(255, 171, 55, 0.2);

  @media screen and (min-width: 600px) {
    font-size: 24px;
  }
}
</style>
