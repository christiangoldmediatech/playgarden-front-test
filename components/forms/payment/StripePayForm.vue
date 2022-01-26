<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <slot name="header">
      <p
        class="text-center text-md-left"
        :class="{ 'mt-n10': $vuetify.breakpoint.smAndUp }"
      >
        <underlined-title class="text-h6 text-md-h5" text="CREDIT CARD INFORMATION" />
      </p>
      <p class="text-center text-md-left">
        <span class="text-header-info">
          We need your credit card information to confirm who you are, but you will NOT be charged.
        </span>
      </p>
    </slot>

    <v-form class="mt-7" @submit.prevent="passes(onSubmit)">
      <!-- Card -->
      <validation-provider
        name="Card number"
        rules="required"
      >
        <stripe-card v-model="draft.token" class="mb-4" />
      </validation-provider>

      <validation-provider
        v-slot="{ errors }"
        name="Promotion Code"
      >
        <pg-text-field
          v-model="draft.promotion_code"
          :error-messages="errors"
          label="Promotion Code"
          :suffix="getTextValidateCoupon"
          solo
        />
      </validation-provider>

      <v-row v-if="!noTerms" class="mb-0">
        <validation-provider v-slot="{ errors }" name="Terms" rules="required">
          <v-checkbox
            v-model="draft.acceptTerms"
            class="accept-terms ml-3 mt-0 pt-0"
            :error-messages="errors"
            :true-value="true"
            :false-value="null"
          >
            <template #label>
              <span>
                I have read and accept the

                <nuxt-link
                  class="terms-conditions link-text ml-1"
                  :to="{ name: 'terms-conditions' }"
                  target="_blank"
                  @click.native.stop=""
                >
                  Terms & Conditions
                </nuxt-link>
              </span>
            </template>
          </v-checkbox>
        </validation-provider>
      </v-row>

      <v-btn
        block
        class="mb-4 mt-0 main-btn ml-md-0"
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
        CLOSE
      </v-btn>
    </v-form>
    <div v-if="$vuetify.breakpoint.smAndUp">
      <p v-if="isFreeForDaysTextVisible">
        <center>
          <span class="font-weight-bold text-completely">
            Playgarden Prep Online is COMPLETELY FREE for the next 30 days.
          </span>
        </center>
      </p>
      <v-divider />
      <slot name="footer">
        <p v-if="isTrialTextVisible">
          <center class="ml-2">
            <span class="info-pay">
              You can cancel your trial and membership anytime from the account settings.<br> Once your free trial ends you will be placed on the <span class="option-standar">Standard</span> monthly plan, you can change plans at any time in your profile page.
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
      default: 'START YOUR FREE TRIAL'
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

    noTerms: Boolean
  },

  data () {
    return {
      lockButton: false,
      isValidCoupon: false
    }
  },

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
    'draft.promotion_code' (val) {
      if (val) {
        this.lockButton = (val.length < 5)
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
    getSubmittableData () {
      return {
        token: this.draft.token,
        promotion_id: this.draft.promotion_id
      }
    },

    async checkValid () {
      if (this.draft.promotion_code) {
        const coupons = await this.getCoupons({ active: true, code: this.draft.promotion_code })
        if (coupons.length > 0) {
          this.draft.promotion_id = coupons[0].promotion_id
          this.$nuxt.$emit('send-coupon', coupons[0])
          this.$snotify.success('Coupon is valid.')
          this.isValidCoupon = true
          this.lockButton = false
        } else {
          this.isValidCoupon = false
          this.lockButton = true
          this.$snotify.warning('Coupon is not valid.', 'Warning', {})
          this.$nuxt.$emit('send-coupon', null)
          this.draft.promotion_id = null
        }
      }
    },

    resetDraft () {
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
.accept-terms ::v-deep .v-label {
  color: var(--v-black-base) !important;
  opacity: 2.49 !important;
}
.info-pay {
  font-size: 12px;
  font-weight: 500;
  color: rgba(96, 96, 96, 0.8) !important;
  text-align: center;
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
</style>
