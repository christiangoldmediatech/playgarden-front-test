<template>
  <div class="plan-description">
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
    <template v-if="plan.homeDeliveryBenefits">
      <!-- <section class="font-weight-bold">
        Home Delivery of:
      </section> -->

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
    </template>

    <template v-if="plan.plusBenefits">
      <!-- <section class="font-weight-bold">
        Plus:
      </section> -->

      <ul class="plan-detail">
        <li
          v-for="(benefit, indexPB) in plan.plusBenefits.benefits"
          :key="indexPB"
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
    }
  },

  computed: {
    getCommonBenefits () {
      return this.plan.commonBenefits.benefits.slice(0, 1)
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
  width: 100%;
  line-height: 5px;
  /*border: 1px blue solid; */
}
.plan-detail li span {
  display: -moz-inline-box;  /* FF2 or lower */
  display: inline-block;     /* FF3, Opera, Safari */
  line-height: 1;
  vertical-align: text-top;
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
</style>
