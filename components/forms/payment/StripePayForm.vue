<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <slot name="header">
      <p
        class="text-center text-md-left"
        :class="{ 'mt-n10': $vuetify.breakpoint.smAndUp }"
      >
        <strong class="text-left">
          {{ $t('payment.stripe.description1') }}<span v-if="isNotChargedTextVisbile">{{ $t('payment.stripe.description2') }}</span>.
        </strong>
        <br>
        <br>
        <underlined-title
          class="text-h6 text-md-h5"
          :text="$t('payment.title')"
        />
      </p>
    </slot>

    <v-form class="mt-7" @submit.prevent="passes(onSubmit)">
      <!-- Card -->
      <validation-provider name="Card number" rules="required">
        <stripe-card v-model="draft.token" class="mb-4" />
      </validation-provider>

      <validation-provider v-slot="{ errors }" name="Promotion Code" rules="min:5">
        <pg-text-field
          v-model="draft.promotion_code"
          :error-messages="errors"
          :label="$t('payment.stripe.promotionCode')"
          class="custom-text-field"
          :color="isValidCoupon ? '' : 'error'"
          :suffix="getTextValidateCoupon"
          :loading="isValidatingCoupon"
          solo
        />
      </validation-provider>

      <v-row v-if="!noTerms" class="mb-0">
        <validation-provider v-slot="{ errors }" name="Terms" rules="required">
          <v-checkbox
            v-model="draft.acceptTerms"
            class="pt-0 mt-0 ml-3 accept-terms"
            :error-messages="errors"
            :true-value="true"
            :false-value="null"
          >
            <template #label>
              <span>
                {{ $t('payment.stripe.acceptTerms1') }}

                <span
                  class="ml-1 terms-conditions link-text"
                  @click="goToTermsAndConditions"
                >
                  {{ $t('payment.stripe.acceptTerms2') }}
                </span>
              </span>
            </template>
          </v-checkbox>
        </validation-provider>
      </v-row>

      <v-btn
        :block="!isPreschoolFlow"
        class="mt-0 mb-4 main-btn "
        :class="{'!pg-block pg-mx-auto pg-w-10/12': isPreschoolFlow, 'ml-md-0': !isPreschoolFlow }"
        min-height="60"
        color="primary"
        :disabled="invalid || lockButton"
        :loading="loading"
        type="submit"
        :x-large="!$vuetify.breakpoint.smAndDown"
      >
        {{ buttonText }}
      </v-btn>

      <v-btn
        v-if="cancelable"
        block
        class="mb-6 main-btn"
        color="accent"
        :loading="loading"
        text
        type="submit"
        x-large
        @click="onCancel(reset)"
      >
        {{ $t('payment.stripe.cancel') }}
      </v-btn>
    </v-form>
    <div class="pb-4 pb-md-0">
      <slot name="sub-footer">
        <p v-if="isFreeForDaysTextVisible">
          <center>
            <span class="font-weight-bold text-completely">
              {{ $t('payment.footer1') }}
              <br />
              {{ $t('payment.footer2') }}
            </span>
          </center>
        </p>
      </slot>
      <br>
      <v-divider v-if="isTrialTextVisible" />
      <br>
      <slot name="footer">
        <p v-if="isTrialTextVisible">
          <center class="ml-2">
            <span class="info-pay">
              <span
                class="d-none d-md-block"
              >{{ $t('payment.stripe.footer1') }}<br></span>

              {{ $t('payment.stripe.footer2') }}
              <span class="option-standar">{{ $t('commonWords.onlinePreschool') }}</span> {{ $t('payment.stripe.footer3') }}
            </span>
          </center>
        </p>
      </slot>
    </div>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'
import submittable from '@/utils/mixins/submittable'
import debounce from 'lodash/debounce'
import StripeCard from '@/components/forms/payment/StripeCard.vue'

export default {
  name: 'StripePayForm',

  components: {
    StripeCard
  },

  mixins: [submittable],

  props: {
    buttonText: {
      type: String,
      default: 'START LEARNING NOW'
    },

    isNotChargedTextVisbile: {
      type: Boolean,
      default: true
    },

    isTrialTextVisible: {
      type: Boolean,
      default: true
    },

    isFreeForDaysTextVisible: {
      type: Boolean,
      default: true
    },

    cancelable: Boolean,

    loading: Boolean,

    noTerms: Boolean,

    isPreschoolFlow: {
      type: Boolean,
      default: false
    }
  },

  data: vm => ({
    lockButton: false,
    isValidCoupon: true,
    isValidatingCoupon: false,
    checkValid: debounce(vm._checkValid, 1050)
  }),

  computed: {
    getTextValidateCoupon () {
      if (this.draft.promotion_code) {
        return (this.isValidCoupon) ? 'VALID COUPON' : 'INVALID COUPON'
      } else {
        return ''
      }
    }
  },

  watch: {
    'draft.promotion_code'(val) {
      if (val) {
        this.lockButton = true
        this.draft.promotion_code = val.toUpperCase()
        if (val.length >= 5) {
          this.checkValid()
        }
      } else {
        this.lockButton = false
        this.draft.promotion_id = null
      }
    }
  },

  methods: {
    ...mapActions('coupons', ['getCoupons']),

    getSubmittableData() {
      return {
        token: this.draft.token,
        promotion_id: this.draft.promotion_id
      }
    },

    goToTermsAndConditions() {
      window.open('https://playgardenonline.com/terms-of-use/', '_blank')
    },

    async _checkValid () {
      try {
        this.isValidatingCoupon = true
        if (this.draft.promotion_code) {
          this.lockButton = true
          const coupons = await this.getCoupons({ active: true, code: this.draft.promotion_code })
          if (coupons.length > 0) {
            this.draft.promotion_id = coupons[0].promotion_id
            this.$nuxt.$emit('send-coupon', coupons[0])
            this.isValidCoupon = true
            this.lockButton = false
          } else {
            this.isValidCoupon = false
            this.lockButton = true
            this.$nuxt.$emit('send-coupon', null)
            this.draft.promotion_id = null
          }
        }
      } catch (error) {
        this.isValidCoupon = false
        this.lockButton = true
      } finally {
        this.isValidatingCoupon = false
      }
    },

    resetDraft() {
      this.draft = {
        token: '',
        promotion_code: null,
        promotion_id: null,
        acceptTerms: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

.accept-terms ::v-deep .v-label {
  color: var(--v-black-base) !important;
  opacity: 2.49 !important;
}
.info-pay {
  font-size: 12px;
  font-weight: 500;
  color: rgba(96, 96, 96, 0.8) !important;
  text-align: center;
  font-weight: bold;
}
.option-standar {
  color: var(--v-accent-base) !important;
}
.text-completely {
  font-size: 12px !important;
  color: rgba(96, 96, 96, 0.8) !important;
}
.text-header-info {
  font-size: 14px !important;
  color: rgba(96, 96, 96, 0.8) !important;
}
.terms-conditions {
  text-decoration: underline !important;
  color: var(--v-black-base);
  font-weight: 400;
  cursor: pointer;
}
::v-deep.v-text-field__suffix {
  color: var(--v-error-base) !important;
}
</style>
