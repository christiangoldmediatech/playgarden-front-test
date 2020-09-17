<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <p :class="{ 'mt-8': $vuetify.breakpoint.smAndDown }">
      <span class="font-weight-bold text-h5 pg-letter-spacing">
        CARD INFORMATION
      </span>
    </p>

    <v-form @submit.prevent="passes(onSubmit)">
      <!-- Card number -->
      <validation-provider
        v-slot="{ errors }"
        name="Card number"
        rules="required|cc_number"
      >
        <v-text-field
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
            <v-text-field
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
            <v-text-field
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

      <v-row>
        <validation-provider v-slot="{ errors }" name="Terms" rules="required">
          <v-checkbox
            v-model="draft.acceptTerms"
            class="accept-terms mb-6 mt-0 pt-0"
            :error-messages="errors"
            :true-value="true"
            :false-value="null"
          >
            <template #label>
              <span class="read-accept">I have read and accept the</span>
            </template>
          </v-checkbox>
        </validation-provider>
        <nuxt-link
          class="terms-conditions link-text ml-1"
          :to="{ name: 'terms-conditions' }"
          tag="span"
          v-text="'Terms & Conditions'"
        />
      </v-row>

      <v-btn
        block
        class="mb-6"
        min-height="60"
        color="primary"
        :disabled="invalid"
        :loading="loading"
        type="submit"
        x-large
      >
        {{ buttonText }}
      </v-btn>

      <p class="mb-15 text-center">
        <span>
          You will only be billed after the one week of FREE trial is completed
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

    loading: Boolean
  },

  methods: {
    getSubmittableData () {
      const [month, year] = this.draft.date.split('/')

      return {
        card: {
          number: this.draft.number.replace(/\D/gm, ''),
          exp_month: month * 1,
          exp_year: year * 1 + 2000,
          cvc: this.draft.cvv
        }
      }
    },

    resetDraft () {
      this.draft = {
        number: null,
        date: null,
        cvv: null,
        acceptTerms: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.accept-terms ::v-deep .v-label {
  color: $pg-black !important;
  opacity: 2.49 !important;
}
.terms-conditions {
  text-decoration: underline !important;
  color: $pg-black;
  font-weight: 400;
  cursor: pointer;
}
</style>
