<template>
  <v-row>
    <info-week v-if="isWeekTwoAndThree" :show="isWeekTwoAndThree" />
    <info-week-four v-if="isWeekFour" :show="isWeekFour" :image-path="imagePath" />
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
    const { isWeekTwoAndThree, isWeekFour, imagePath, isNotificationSignupModalVisible, showNotificationSignupModal, hideNotificationSignuoModal, fetchUserInfo } = useGlobalModal()

    onMounted(() => {
      fetchUserInfo()
    })
    return {
      isWeekTwoAndThree,
      isWeekFour,
      imagePath,
      isNotificationSignupModalVisible,
      showNotificationSignupModal,
      hideNotificationSignuoModal
    }
  }
})
</script>
