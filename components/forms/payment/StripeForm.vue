<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <p
      class="text-center text-md-left"
      :class="{ 'mt-8': $vuetify.breakpoint.smAndDown }"
    >
      <span class="font-weight-bold text-h5 pg-letter-spacing">
        CARD INFORMATION
      </span>
    </p>

    <v-form class="mt-7" @submit.prevent="passes(onSubmit)">
      <!-- Card number -->
      <validation-provider
        v-slot="{ errors }"
        name="Card number"
        rules="required|cc_number"
      >
        <pg-text-field
          v-model="draft.number"
          v-mask="['#### #### #### ####']"
          clearable
          :disabled="loading"
          :error-messages="errors"
          :loading="loading"
          maxlength="19"
          placeholder="Card number"
          solo
          class="custom-text-field"
        />
      </validation-provider>

      <v-row>
        <v-col class="pb-0" cols="6">
          <!-- Expiration date -->
          <validation-provider
            v-slot="{ errors }"
            name="Expiration date"
            rules="required|cc_exp_date"
          >
            <pg-text-field
              v-model="draft.date"
              v-mask="['##/##']"
              clearable
              :disabled="loading"
              :error-messages="errors"
              :loading="loading"
              maxlength="5"
              placeholder="MM/YY"
              solo
              class="custom-text-field"
            />
          </validation-provider>
        </v-col>

        <v-col class="pb-0" cols="6">
          <!-- CVV -->
          <validation-provider
            v-slot="{ errors }"
            name="CVV"
            rules="required|digits:3"
          >
            <pg-text-field
              v-model="draft.cvv"
              clearable
              :disabled="loading"
              :error-messages="errors"
              :loading="loading"
              maxlength="3"
              placeholder="CVV"
              solo
              class="custom-text-field"
            />
          </validation-provider>
        </v-col>
      </v-row>

      <validation-provider
        v-slot="{ errors }"
        name="Promotion Code"
      >
        <pg-text-field
          v-model="draft.promotion_code"
          :error-messages="errors"
          label="Promotion Code"
          solo
          @blur="checkValid"
        />
      </validation-provider>

      <v-row v-if="!noTerms" class="mb-6">
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
        class="mb-4 mt-4 main-btn ml-n4 ml-md-0"
        min-height="60"
        color="primary"
        :disabled="invalid"
        :loading="loading"
        type="submit"
        x-large
      >
        {{ buttonText }}
      </v-btn>

      <p v-if="!noTrial" class="mb-15 text-body-2 text-center messages-info-register">
        <span>
          You will only be billed after 30 days of FREE trial is completed
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
        CANCEL
      </v-btn>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'
import submittable from '@/utils/mixins/submittable'

export default {
  name: 'StripeForm',

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
      const [month, year] = this.draft.date.split('/')

      return {
        card: {
          number: this.draft.number.replace(/\D/gm, ''),
          exp_month: month * 1,
          exp_year: year * 1 + 2000,
          cvc: this.draft.cvv
        },
        promotion_id: this.draft.promotion_id
      }
    },

    async checkValid () {
      const coupons = await this.getCoupons({ active: true, code: this.draft.promotion_code })
      if (coupons.length > 0) {
        // console.log(coupons[0].promotion_id)
        this.draft.promotion_id = coupons[0].promotion_id
        this.$snotify.success('Coupon is valid.')
      } else {
        this.$snotify.warning('Coupon is not valid.', 'Warning', {})
        this.draft.promotion_code = null
        this.draft.promotion_id = null
      }
    },

    resetDraft () {
      this.draft = {
        number: null,
        date: null,
        cvv: null,
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
.terms-conditions {
  text-decoration: underline !important;
  color: var(--v-black-base);
  font-weight: 400;
  cursor: pointer;
}
</style>
