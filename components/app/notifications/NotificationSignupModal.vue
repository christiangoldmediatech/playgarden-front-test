<template>
  <v-row>
    <info-week :is-notification-info="isNotificationSignupModalVisible" />
    <!-- <info-week-four /> -->
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import InfoWeek from '@/components/app/notifications/InfoWeek.vue'
import InfoWeekFour from '@/components/app/notifications/InfoWeekFour.vue'
import { useGlobalModal } from '@/composables'

export default defineComponent({
  name: 'NotificationSignupModal',

  components: {
    InfoWeek,
    InfoWeekFour
  },

  setup () {
    const { isNotificationSignupModalVisible, showNotificationSignupModal, hideNotificationSignuoModal } = useGlobalModal()
    return {
      isNotificationSignupModalVisible,
      showNotificationSignupModal,
      hideNotificationSignuoModal
    }
  }
})
</script>
