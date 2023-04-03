<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <p
      class="text-center text-md-left"
      :class="{ 'mt-8': $vuetify.breakpoint.smAndDown }"
    >
      <span class="font-weight-bold text-h5 pg-letter-spacing">
        PAYMENT INFORMATION
      </span>
    </p>

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
          solo
          class="custom-text-field"
          @blur="checkValid"
        />
      </validation-provider>

      <v-row v-if="!noTerms" class="mb-6">
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
                I have read and accept the

                <nuxt-link
                  class="ml-1 terms-conditions link-text"
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
        class="mt-4 mb-4 main-btn"
        min-height="60"
        color="primary"
        :disabled="invalid"
        :loading="loading"
        type="submit"
        :x-large="!$vuetify.breakpoint.smAndDown"
      >
        {{ buttonText }}
      </v-btn>

      <p v-if="!noTrial" class="text-center mb-15 text-body-2 messages-info-register">
        <span>
          You will only be billed after your 15-day FREE trial is complete!
        </span>
      </p>

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
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'
import submittable from '@/utils/mixins/submittable'

import StripeCard from '@/components/forms/payment/StripeCard.vue'

export default {
  name: 'StripeForm',

  components: {
    StripeCard
  },

  mixins: [submittable],

  props: {
    buttonText: {
      type: String,
      default: 'START YOUR FREE TRIAL'
    },

    cancelable: Boolean,

    loading: Boolean,

    noTerms: Boolean,

    noTrial: Boolean
  },

  watch: {
    'draft.promotion_code' (val) {
      if (val) {
        this.draft.promotion_code = val.toUpperCase()
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
        } else {
          this.$nuxt.$emit('send-coupon', null)
          this.draft.promotion_code = null
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
@import '~/assets/scss/app.scss';

.accept-terms ::v-deep .v-label {
  color: var(--v-black-base) !important;
  opacity: 2.49 !important;
}
.terms-conditions {
  text-decoration: underline !important;
  color: var(--v-black-base);
  font-weight: 400;
  cursor: pointer;
}
</style>
