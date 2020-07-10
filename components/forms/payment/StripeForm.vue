<template>
  <validation-observer v-slot="{ invalid, validated, passes }">
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
          label="Card number"
          :loading="loading"
          maxlength="19"
          outlined
          placeholder="1234-4567-8901-2345"
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
              clearable
              :disabled="loading"
              :error-messages="errors"
              label="Expiration date"
              :loading="loading"
              maxlength="5"
              outlined
              placeholder="MM/YY"
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
              label="CVV"
              :loading="loading"
              maxlength="3"
              outlined
              placeholder="123"
            />
          </validation-provider>
        </v-col>
      </v-row>

      <v-btn
        block
        class="mb-6"
        color="primary"
        :disabled="invalid"
        :loading="loading"
        type="submit"
      >
        BUY
      </v-btn>
    </v-form>
  </validation-observer>
</template>

<script>
export default {
  name: 'StripeForm',

  props: {
    loading: Boolean
  },

  data: () => ({
    draft: {
      number: '',
      date: '',
      cvv: ''
    }
  }),

  methods: {
    onSubmit () {
      const [month, year] = this.draft.date.split('/')

      this.$emit('click:submit', {
        card: {
          number: this.draft.number.replace(/\D/gm, ''),
          exp_month: month * 1,
          exp_year: year * 1 + 2000,
          cvc: this.draft.cvv
        }
      })
    }
  }
}
</script>
