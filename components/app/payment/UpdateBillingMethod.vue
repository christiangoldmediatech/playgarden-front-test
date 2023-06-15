<template>
  <stripe-form
    :button-text="$t('commonWords.save')"
    cancelable
    :loading="loading"
    :no-terms="noTerms"
    :no-trial="noTrial"
    @click:cancel="$emit('click:cancel')"
    @click:submit="onSubmit"
  />
</template>

<script>
import { mapActions } from 'vuex'

import StripeForm from '@/components/forms/payment/StripeForm'

export default {
  name: 'UpdateBillingMethod',

  components: {
    StripeForm
  },

  props: {
    cardId: {
      type: [Number, String],
      required: true
    },

    noTerms: Boolean,

    noTrial: Boolean
  },

  data: () => ({
    loading: false
  }),

  methods: {
    ...mapActions('payment', ['updateBillingCard']),

    async onSubmit (data) {
      this.loading = true

      try {
        await this.updateBillingCard({ id: this.cardId, data })
        this.editing = false
        this.$toast.success('Card has been updated successfully!')
        this.$emit('update:success')
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped></style>
