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
        <div class="promotion-ribbon pa-3 ml-n14 ml-md-n8 mr-3 my-6 text-center">
          <span class="font-weight-bold body-2 accent--text">* Join now and you will get this benefits:</span>
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
    getCommonBenefits () {
      return this.plan.commonBenefits.benefits.slice(0, 1)
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
  content: "✔";
  color: var(--v-primary-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 1em; /* Also needed for space (tweak if needed) */
  margin-left: -1.4rem; /* Also needed for space (tweak if needed) */
  margin-right: 0.5rem;
}

.plan-detail li {
  width: 97%;
  line-height: 5px;
  /*border: 1px blue solid; */
}
.plan-detail li span {
  display: -moz-inline-box;  /* FF2 or lower */
  display: initial;     /* FF3, Opera, Safari */
  line-height: 1;
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
  background: rgba(248, 152, 56, 0.3);
}
</style>
