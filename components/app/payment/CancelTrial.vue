<template>
  <div>
    <div v-if="isUserInTrial" class="pg-flex pg-justify-between pg-items-center">
      <div class="pg-text-2xl pg-font-bold pg-text-accent">
        END YOUR TRIAL NOW:
      </div>

      <v-btn
        :loading="isLoading"
        outlined
        x-large
        class="!pg-shadow-button pg-w-[240px] !pg-h-[40px]"
        color="accent"
        @click="cancelTrial"
      >
        CLICK HERE
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

    async function cancelTrial() {
      try {
        isLoading.value = true
        await Billing.cancelTrial()

        Notification.setIsPlanUpgradeModalVisible(true)
      } catch (err) {
        snotify.error('Could not cancel trial. Please try again later.')
      } finally {
        isLoading.value = false
      }
    }

    return {
      isUserInTrial: Auth.isUserInTrial,
      isLoading,
      cancelTrial
    }
  }
})
</script>
