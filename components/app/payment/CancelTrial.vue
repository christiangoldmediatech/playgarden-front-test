<template>
  <div>
    <div v-if="isUserInTrial" class="pg-flex pg-flex-col pg-justify-between pg-items-center">
      <div class="pg-text-[22px] pg-text-pg-grey">
        If you'd like to end your  trial early, click the button below!
      </div>

      <v-btn
        :loading="isLoading"
        outlined
        x-large
        class="!pg-shadow-button pg-mt-4 !pg-h-[40px]"
        color="accent"
        @click="handleCancelTrial"
      >
        END FREE TRIAL NOW
      </v-btn>
    </div>

    <!-- CREDIT CARD MODAL -->
    <credit-card-modal
      v-model="isCreditCardModalVisible"
      back-button-text="Back to profile"
      @card-added="handleCancelTrial"
    />
  </div>
</template>

<script lang="ts">
import { useNotification, useBilling, useToastHelper, useAuth } from '@/composables'
import { TypedStore } from '@/models'
import { defineComponent, ref, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  components: {
    CreditCardModal: () => import('@/components/app/payment/CreditCardModal.vue')
  },

  setup() {
    const isCreditCardModalVisible = ref(false)
    const isLoading = ref(false)
    const store = useStore<TypedStore>()
    const toast = useToastHelper()
    const Notification = useNotification({ store })
    const Auth = useAuth({ store })
    const Billing = useBilling()

    async function handleCancelTrial() {
      try {
        isLoading.value = true

        // Show credit card modal if user has no card on file
        const userCards = await Billing.fetchBillingCards()

        if (userCards?.length === 0) {
          isCreditCardModalVisible.value = true
          isLoading.value = false
          return
        }

        await Billing.cancelTrial()
        await Auth.fetchUserInfo()

        Notification.setIsCanceledTrialModalVisible(true)
      } catch (err) {
        toast.error('Could not cancel trial. Please try again later.')
      } finally {
        isLoading.value = false
      }
    }

    return {
      isCreditCardModalVisible,
      isUserInTrial: Auth.isUserInTrial,
      isLoading,
      handleCancelTrial
    }
  }
})
</script>
