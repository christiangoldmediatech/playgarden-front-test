<template>
  <pg-dialog
    :value="isModalVisible"
    max-width="600px"
    persistent
    content-class="white pa-4"
  >
    <stripe-pay-form
      :is-free-for-days-text-visible="false"
      :loading="isPaymentMethodModalLoading"
      :cancelable="false"
      :no-terms="true"
      button-text="Continue"
      @click:submit="handlePaymentSubmit"
    >
      <template #header>
        <center class="pt-6">
          <underlined-title class="text-h6 text-md-h5" text="CREDIT CARD INFORMATION" />
        </center>
        <center class="grey--text text--darken-1 my-6 text-body-2">
          We need your credit card information to confirm who you are.
        </center>
      </template>
      <template #footer>
        <center>
          <div class="font-weight-bold grey--text text--darken-1 mt-6 mb-2 text-body-2">
            You can cancel your trial and membership anytime from the account settings.
          </div>
        </center>
      </template>
    </stripe-pay-form>
  </pg-dialog>
</template>

<script lang="ts">
import { defineComponent, useStore, computed, ref } from '@nuxtjs/composition-api'
import StripePayForm from '@/components/forms/payment/StripePayForm.vue'
import { TypedStore } from '@/models'
import { useNotification, useSnotifyHelper } from '@/composables'

export default defineComponent({
  components: {
    StripePayForm
  },

  setup () {
    const store = useStore<TypedStore>()
    const notification = useNotification({ store })
    const snotify = useSnotifyHelper()
    const isPaymentMethodModalLoading = ref(false)

    const isModalVisible = computed({
      get() {
        return notification.isCreditCardModalVisible.value
      },
      set (value: boolean) {
        notification.setIsCreditCardModalVisible(value)
      }
    })

    function closeModal () {
      isModalVisible.value = false
    }

    async function handlePaymentSubmit (data: any) {
      try {
        isPaymentMethodModalLoading.value = true

        const dataSubscrition = {
          token: data.token,
          sendEmail: true,
          promotion_id: null
        }

        if (data.promotion_id) {
          dataSubscrition.promotion_id = data.promotion_id
        }

        await store.dispatch('fetchBillingCards/addBillingCard', dataSubscrition)
        snotify.success('Payment method added!')
        closeModal()
        notification.setIsTrialEndingPlanSelectedModalVisible(true)
      } catch (error) {
        snotify.error('There was an error adding your payment method.')
      } finally {
        isPaymentMethodModalLoading.value = false
      }
    }

    return {
      isModalVisible,
      isPaymentMethodModalLoading,
      handlePaymentSubmit
    }
  }
})
</script>
