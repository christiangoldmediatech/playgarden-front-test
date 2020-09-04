<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <p>
      <span class="font-weight-bold text-h5">
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
        <v-col cols="6">
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

        <v-col cols="6">
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

      <v-checkbox
        v-model="draft.accepTerms"
        label="I have read and accept Terms & Conditions"
        class="accept-terms"
      ></v-checkbox>

      <v-btn
        block
        class="mb-6"
        color="primary"
        :disabled="invalid"
        :loading="loading"
        type="submit"
        x-large
      >
        {{ buttonText }}
      </v-btn>
      <center class="mb-15">
        <span>You will only be billed after one week of FREE trial is completed</span>
      </center>

      <v-btn
        v-if="cancelable"
        block
        class="mb-6"
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
        number: '',
        date: '',
        cvv: '',
        accepTerms: false
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
</style>
