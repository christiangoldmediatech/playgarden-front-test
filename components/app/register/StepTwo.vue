<template>
  <div :class="['pg-px-4', 'lg:pg-pb-32']">
    <div
      :class="[
        'pg-flex',
        'pg-flex-col',
        'pg-mx-auto',
        'pg-max-w-[768px]',
        'lg:pg-max-w-[1300px]'
      ]"
    >
      <PromoCodeDialog
        v-model="showPromoCodeDialog"
        @reject="handlePromoCodeRejection"
      />

      <div class="pg-my-6">
        <BackButton @click="handleBackButtonClick" />
      </div>

      <!-- CONTENT -->
      <div
        :class="[
          'pg-grid',
          'pg-grid-cols-1',
          'sm:pg-mt-12',
          'lg:pg-grid-cols-12',
          'lg:pg-gap-24'
        ]"
      >
        <!-- LEFT -->
        <div class="pg-col-span-full lg:pg-col-span-7">
          <StripePayForm
            :loading="loading"
            :button-text="getTextButton"
            :is-free-for-days-text-visible="!isUserInactive"
            :is-trial-text-visible="!isUserInactive"
            :is-not-charged-text-visbile="!isUserInactive"
            @click:submit="onSubmit"
          />
        </div>

        <!-- RIGHT -->
        <div
          :class="[
            'pg-col-span-full',
            'pg-flex',
            'pg-flex-col',
            'pg-justify-center',
            'pg-mt-14',
            'pg-mx-auto',
            'lg:pg-col-span-5',
            'lg:pg-mt-0'
          ]"
        >
          <CardPlaygarden
            :value="showCardPlaygarden"
            :is-user-inactive="isUserInactive"
            @input="showCardPlaygarden = !showCardPlaygarden"
          />
          <div class="pg-py-2" />
          <CardKnowMore
            v-if="!isUserInactive"
            :value="!showCardPlaygarden"
            @input="showCardPlaygarden = !showCardPlaygarden"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api'
import { mapActions } from 'vuex'

import { useUTM } from '@/composables/web/utm'
import { usePromoCodeDialog } from '@/composables/web/signup'

import StripePayForm from '@/components/forms/payment/StripePayForm.vue'
import BackButton from '@/components/shared/BackButton/BackButton.vue'
import CardPlaygarden from './CardPlaygarden.vue'
import CardKnowMore from './CardKnowMore.vue'

export default defineComponent({
  name: 'StepTwo',

  components: {
    StripePayForm,
    CardPlaygarden,
    CardKnowMore,
    BackButton
  },

  props: {
    mode: {
      type: String,
      default: '',
      required: false
    }
  },

  data: () => ({
    loading: false,
    showCardPlaygarden: true,
    hiddenCardFamily: false,
    coupon: null
  }),

  setup(props) {
    const route = useRoute()
    const utmContent = useUTM({ route: route.value })
    const PromoCodeDialog = usePromoCodeDialog({
      isUserInactive: computed(() => props.mode === ''),
      router: useRouter()
    })

    return {
      utmContent,
      showPromoCodeDialog: PromoCodeDialog.showPromoCodeDialog,
      handlePromoCodeRejection: PromoCodeDialog.handlePromoCodeRejection,
      handleBackButtonClick: PromoCodeDialog.handleBackButtonClick
    }
  },

  watch: {
    showCardPlaygarden() {
      this.hiddenCardFamily = !this.hiddenCardFamily
    }
  },

  computed: {
    getTextButton() {
      return this.mode === 'activate-user'
        ? this.$i18n.t('account.membership.reactivate')
        : this.$i18n.t('account.membership.startTrial')
    },
    isUserInactive() {
      return this.mode === 'activate-user'
    }
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),

    ...mapActions('payment', ['payShorterSubscription', 'validateCard']),

    async goToNextStep() {
      let page = {}
      if (this.mode === 'activate-user') {
        await this.fetchUserInfo()
        page = {
          name: 'app-payment-plan'
        }
      } else {
        page = {
          name: 'app-children',
          query: {
            step: 4,
            process: 'signup',
            ...this.utmContent.utmContent.value
          }
        }
      }
      this.$router.push(page)
    },

    async onSubmit(cardData) {
      this.loading = true

      try {
        const dataSubscrition = {
          token: cardData.token
        }

        if (cardData.promotion_id) {
          dataSubscrition.promotion_id = cardData.promotion_id
        }
        await this.payShorterSubscription(dataSubscrition)
        this.goToNextStep()
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.discount-label {
  margin-right: 17%;
}

.product-name {
  color: #606060;
  line-height: 1.5;
  font-size: 16px;
  letter-spacing: 1.8px;
  font-weight: 400;
}

.product-description {
  color: #606060;
  line-height: 1.5;
  font-size: 16px;
  text-align: right;
  font-weight: 500;
}

.total,
.total-cost {
  color: #606060;
  line-height: 1.5;
  font-size: 22px;
  letter-spacing: 1.8px;
  font-weight: 400;
}

.due-today {
  background-color: var(--v-accent-base);
  border-radius: 8px;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 1.5;
  width: 100%;
  color: white;
}

.image {
  max-height: 500px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    max-width: 90%;
  }
  &.mobile {
    max-height: 250px;
  }
}
.text-orange-info {
  background-color: var(--v-accent-base) !important;
  color: var(--v-white-base) !important;
  height: 19px;
  font-size: 15px;
}
.text-orange-info::v-deep.v-chip .v-chip__content {
  color: var(--v-white-base) !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 3.15px;
  line-height: 1.48;
  background-color: var(--v-accent-base) !important;
}
.text-orange-info::v-deep.v-chip--label {
  border-radius: 0px !important;
}
.free-trial {
  font-size: 22px !important;
}
.free-trial-mobile {
  font-size: 14px !important;
}
.text-completely {
  font-size: 12px !important;
  color: #606060 !important;
}
.list-scroll {
  max-height: 500px;
  overflow-y: auto !important;
}
.info-pay {
  font-size: 12px;
  font-weight: 500;
  color: rgba(96, 96, 96, 0.8) !important;
  text-align: center;
}
</style>
