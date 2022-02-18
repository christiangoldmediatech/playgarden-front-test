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
  </div>
</template>

<script lang="ts">
import { useNotification, useBilling, useSnotifyHelper, useAuth } from '@/composables'
import { TypedStore } from '@/models'
import { defineComponent, ref, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const isLoading = ref(false)
    const store = useStore<TypedStore>()
    const snotify = useSnotifyHelper()
    const Notification = useNotification({ store })
    const Auth = useAuth({ store })
    const Billing = useBilling()

    async function handleCancelTrial() {
      try {
        isLoading.value = true
        await Billing.cancelTrial()
        await Auth.fetchUserInfo()

        Notification.setIsCanceledTrialModalVisible(true)
      } catch (err) {
        snotify.error('Could not cancel trial. Please try again later.')
      } finally {
        isLoading.value = false
      }
    }

    return {
      isUserInTrial: Auth.isUserInTrial,
      isLoading,
      handleCancelTrial
    }
  }
})
</script>
