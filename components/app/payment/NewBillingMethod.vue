<template>
  <stripe-form
    button-text="SAVE"
    cancelable
    :loading="loading"
    @click:cancel="$emit('click:cancel')"
    @click:submit="onSubmit"
  />
</template>

<script>
import { mapActions } from 'vuex'

import StripeForm from '@/components/forms/payment/StripeForm'

export default {
  name: 'NewBillingMethod',

  components: {
    StripeForm
  },

  data: () => ({
    loading: false
  }),

  methods: {
    ...mapActions('payment', ['addBillingCard']),

    async onSubmit (draft) {
      this.loading = true

      try {
        await this.addBillingCard(draft)
        this.editing = false

        this.$toast.success('Card has been added successfully!')

        this.$emit('add:success')
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped></style>
