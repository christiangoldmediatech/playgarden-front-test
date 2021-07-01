<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-overlay
        :dark="false"
        :value="isNotificationSignupModalVisible"
        z-index="4000"
      >
        <v-btn :disabled="loading" icon>
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
        <!--  <info-week-four />  -->
        <info-week-three />
      </v-overlay>
    </v-row>
  </v-container>
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
