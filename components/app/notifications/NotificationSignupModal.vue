<template>
  <div>
    <v-row v-if="isNotification.isNotificationSignupModalVisible">
      <info-week v-if="isNotification.isWeekTwoAndThree" :show="isNotification.isWeekTwoAndThree" />
      <info-week-four v-if="isNotification.isWeekFour" :show="isNotification.isWeekFour" :image-path="isNotification.imagePath" />
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
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
    const { isNotification, showNotificationSignupModal, hideNotificationSignupModal } = useGlobalModal()

    onMounted(() => {
      // fetchUserInfo()
      showNotificationSignupModal()
    })

    const closeModal = () => {
      hideNotificationSignupModal()
    }
    return {
      isNotification,
      showNotificationSignupModal
    }
  }
})
</script>
