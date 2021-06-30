import { ref } from '@nuxtjs/composition-api'

const isContactUsModalVisible = ref(false)
const isNotificationSignupModalVisible = ref(true)

export const useGlobalModal = () => {
  const showContactUsModal = () => {
    isContactUsModalVisible.value = true
  }
  const hideContactUsModal = () => {
    isContactUsModalVisible.value = false
  }

  const showNotificationSignupModal = () => {
    isNotificationSignupModalVisible.value = true
  }
  const hideNotificationSignuoModal = () => {
    isNotificationSignupModalVisible.value = false
  }

  return {
    isContactUsModalVisible,
    isNotificationSignupModalVisible,
    showContactUsModal,
    hideContactUsModal,
    showNotificationSignupModal,
    hideNotificationSignuoModal
  }
}
