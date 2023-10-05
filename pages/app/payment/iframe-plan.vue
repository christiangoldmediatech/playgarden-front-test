<template>
  <v-main>
    <v-container v-if="plans.length > 0" fluid>
      <v-row class="mb-6" no-gutters>
        <v-col cols="12" class="mt-5">
          <!-- Bill monthly/anually switch -->
          <div class="pg-flex pg-justify-center">
            <div class="pg-flex pg-items-center">
              <span class="pg-mr-3 pg-text-[14px] sm:pg-text-xl pg-font-semibold">{{ $t('paymentPlan.subscriptionPlan.billMonthly') }}</span>
              <v-switch v-model="billBiannually" color="#FFA0C8" inset />
              <span class="pg-block pg-mt-[15px] sm:pg-mt-0 pg-text-[14px] sm:pg-text-xl pg-font-semibold">
                {{ $t('paymentPlan.subscriptionPlan.billBiannually') }} <br v-if="$vuetify.breakpoint.xs" />
                <span class="pg-font-normal pg-text-[12px] sm:pg-text-xl">{{ $t('paymentPlan.subscriptionPlan.sixMonths') }}</span>
              </span>
            </div>
          </div>

          <!-- Plan columns -->
          <v-row class="pg-w-[95%] pg-max-w-[1300px] pg-m-auto">
            <v-col
              v-for="plan in plans"
              :key="plan.name"
              cols="12"
              :md="Math.ceil(12 / plans.length)"
            >
              <div
                class="card-shadow pg-rounded-[3px] pg-bg-white"
                :class="{
                  'pg-flex pg-flex-col pg-justify-between pg-h-full pg-min-h-[1500px]':
                    $vuetify.breakpoint.mdAndUp
                }"
              >
                <div>
                  <!-- Plan image -->
                  <div
                    class="pg-relative plan-image"
                    :style="{ '--gradient-color': plan.color }"
                  >
                    <div class="text-over-image-container pg-px-3 pg-pb-6">
                      <!-- Plan name -->
                      <span class="text-over-image v2-font">
                        {{ plan.name }}
                      </span>
                    </div>

                    <!-- Image -->
                    <img
                      class="pg-w-full"
                      :src="plan.image"
                      :alt="plan.name"
                    />
                  </div>

                  <!-- Price -->
                  <div
                    class="pg-text-center pg-my-4 pg-px-4 pg-text-4xl pg-font-semibold v2-font"
                    :style="{ color: plan.color }"
                  >
                    <template v-if="billBiannually">
                      ${{ plan.priceBiannual.toFixed(2) }}
                      <span class="pg-text-2xl">{{ $t('paymentPlan.subscriptionPlan.biannual') }}</span>
                    </template>
                    <template v-else>
                      ${{ plan.priceMonthly.toFixed(2) }}
                      <span class="pg-text-2xl">{{ $t('paymentPlan.subscriptionPlan.month') }}</span>
                    </template>
                  </div>

                  <!-- Subtitle -->
                  <div
                    class="pg-px-8 pg-py-1 pg-text-[#FFA0C8] pg-text-lg pg-text-center pg-font-medium v2-font"
                  >
                    {{ $t('paymentPlan.bestFor') }}<br />
                    {{ plan.commonBenefits.bestFor }}
                  </div>

                  <div
                    class="pg-px-8 pg-py-1 pg-text-[#BA89EB] pg-text-lg pg-font-medium v2-font"
                  >
                    {{ plan.commonBenefits.title || $t('paymentPlan.subscriptionPlan.subtitle') }}
                  </div>

                  <!-- Description -->
                  <plan-description class="pg-p-5" :plan="plan" :color="plan.color" />
                </div>

                <div class="pg-px-8 pg-py-6">
                  <!-- Choose plan -->
                  <v-btn
                    outlined
                    block
                    :loading="loading"
                    :color="plan.color"
                    :disabled="planIsSelected(plan)"
                    @click="redirectPlaygarden(plan)"
                  >
                    {{ !planIsSelected(plan) ? $t('paymentPlan.subscriptionPlan.choose') : $t('paymentPlan.subscriptionPlan.current') }}
                  </v-btn>

                  <p class="pg-text-center pg-text-sm pg-mt-4">
                    {{ $t('paymentPlan.subscriptionPlan.footer') }}
                  </p>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <pg-loading v-else />
  </v-main>
</template>

<script>
import {
  defineComponent
} from '@nuxtjs/composition-api'
import { mapActions, mapGetters } from 'vuex'

import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'
import { Plan } from '@/models'
import PlanDescription from '@/components/app/payment/SubscriptionPlanSelection/PlanDescription.vue'

export default defineComponent({
  name: 'Plan',

  layout: 'empty',

  components: {
    SubscriptionPlanSelection,
    PlanDescription
  },

  computed: {
    ...mapGetters('auth', ['getUserInfo'])
  },

  data: () => ({
    /** @type {import('@/models').Plan[]} */
    plans: [],
    loading: false,
    billBiannually: false
  }),

  methods: {
    ...mapActions('payment', [
      'fetchSubscriptionPlan'
    ]),
    ...mapActions('auth', [
      'fetchUserInfo'
    ]),

    planIsSelected(plan) {
      const type = this.billBiannually ? 'semester' : 'month'
      if (this.getUserInfo && this.getUserInfo.planSelected && plan && plan.name) {
        return this.getUserInfo.planSelected.name === plan.name && this.getUserInfo.subscription.plan.interval === type
      }
      return false
    },

    async fetchPlans() {
      try {
        this.plans = await this.fetchSubscriptionPlan()
      } catch (e) {}
    },

    async fetchUserData () {
      const isLoggedIn = this.$route.query.isLogged
      if (isLoggedIn) {
        await this.fetchUserInfo()
      }
    },

    redirectPlaygarden(plan) {
      const isLoggedIn = this.$route.query.isLogged

      if (isLoggedIn) {
        window.open(`https://playgardenonline.com/school/app/payment/plan?planId=${plan.id}&biannually=${this.billBiannually ? 'yes' : 'no'}`, '_parent')
      } else {
        window.open('https://playgardenonline.com/school/auth/preschool/normal', '_parent')
      }
    }
  },

  async created() {
    await this.fetchPlans()
    await this.fetchUserData()
  }

})
</script>

<style scoped lang="scss">
.card-shadow {
  box-shadow: 0px 3px 17px rgba(0, 0, 0, 0.25);
}

.text-over-image-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  width: 100%;
  height: calc(100% - 20px);
  color: white;
  font-weight: 600;
  letter-spacing: 1px;
}

.text-over-image {
  font-size: 36px;
  line-height: 40px;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: relative;

  @media (min-width: 960px) and (max-width: 1264px) {
    font-size: 24px;
    line-height: 32px;
  }
}

.plan-image {
  --gradient-color: transparent;
  &::before {
    background: linear-gradient(0deg, var(--gradient-color) 0%, transparent);
    content: '';
    width: 100%;
    height: 33%;
    display: block;
    position: absolute;
    bottom: 4px;
  }

  &::after {
    content: '';
    border: 4px solid var(--gradient-color);
    position: absolute;
    top: 20px;
    left: 20px;
    height: calc(100% - 40px);
    width: calc(100% - 40px);
  }
}

@media (min-width: 425px) and (max-width: 1023px) {
  .text-over-image {
    font-size: 48px;
    line-height: 1;
  }

  .text-over-image-container {
    padding-bottom: 56px;
  }
}
</style>
