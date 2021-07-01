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
        <info-week-four />
      </v-overlay>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { useGlobalModal } from '@/composables'
import InfoWeekFour from '@/components/app/notifications/InfoWeekFour.vue'

export default defineComponent({
  name: 'NotificationSignupModal',

  components: {
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
