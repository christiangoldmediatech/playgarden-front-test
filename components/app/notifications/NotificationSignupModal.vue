<template>
  <v-row v-if="isNotificationSignupModalVisible">
    <!-- <info-week v-if="isWeekTwoAndThree" :show="isNotificationSignupModalVisible" /> -->
    <info-week-four v-if="isWeekFour" :show="isNotificationSignupModalVisible" :image-path="imagePath" />
  </v-row>
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
    const { isWeekTwoAndThree, isWeekFour, imagePath, isNotificationSignupModalVisible, showNotificationSignupModal, hideNotificationSignupModal, fetchUserInfo } = useGlobalModal()

    onMounted(() => {
      fetchUserInfo()
      showNotificationSignupModal()
    })

    const closeModal = () => {
      hideNotificationSignupModal()
    }
    return {
      isWeekTwoAndThree,
      isWeekFour,
      imagePath,
      isNotificationSignupModalVisible,
      showNotificationSignupModal
    }
  }
})
</script>
