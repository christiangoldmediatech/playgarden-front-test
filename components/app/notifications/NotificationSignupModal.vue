<template>
  <v-row>
    <!--  <info-week-four />  -->
    <info-week-three />
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { useGlobalModal } from '@/composables'
import InfoWeekFour from '@/components/app/notifications/InfoWeekFour.vue'
import InfoWeekThree from '@/components/app/notifications/InfoWeekThree.vue'

export default defineComponent({
  name: 'NotificationSignupModal',

  components: {
    InfoWeekFour,
    InfoWeekThree
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
