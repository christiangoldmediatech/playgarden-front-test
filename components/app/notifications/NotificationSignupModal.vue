<template>
  <div>
    <v-row v-if="isNotification.isNotificationSignupModalVisible">
      <info-week v-if="isNotification.isWeekTwoAndThree && !isNotification.isSubscriptionPlan" :show="isNotification.isWeekTwoAndThree" :image-path="isNotification.imagePath" />
      <info-week-four v-if="isNotification.isWeekFour && !isNotification.isSubscriptionPlan" :show="isNotification.isWeekFour" :image-path="isNotification.imagePath" />
      <select-plan v-if="isNotification.isSubscriptionPlan" :show="isNotification.isSubscriptionPlan" />
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, useStore } from '@nuxtjs/composition-api'
import { useGlobalModal } from '@/composables'
import InfoWeek from '@/components/app/notifications/InfoWeek.vue'
import InfoWeekFour from '@/components/app/notifications/InfoWeekFour.vue'
import SelectPlan from '@/components/app/notifications/SelectPlan.vue'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'NotificationSignupModal',

  components: {
    InfoWeek,
    InfoWeekFour,
    SelectPlan
  },

  setup () {
    const store = useStore<TypedStore>()
    const { isNotification, showNotificationSignupModal, hideNotificationSignupModal } = useGlobalModal({ store })

    onMounted(() => {
      showNotificationSignupModal()
    })

    return {
      isNotification,
      showNotificationSignupModal,
      hideNotificationSignupModal
    }
  }
})
</script>
