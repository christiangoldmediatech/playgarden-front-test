import { ref } from '@nuxtjs/composition-api'
// import { useAuth } from '@/composables'

const isContactUsModalVisible = ref(false)
const isNotificationSignupModalVisible = ref(true)
const imagePath = ref('')

export const useGlobalModal = () => {
  // const { userInfo, isUserLoggedIn } = useAuth()

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

  const setImagePath = () => {
    imagePath.value = require('@/assets/svg/girl.svg')
  }

  return {
    isContactUsModalVisible,
    isNotificationSignupModalVisible,
    imagePath,
    showContactUsModal,
    hideContactUsModal,
    showNotificationSignupModal,
    hideNotificationSignuoModal,
    setImagePath
  }
}
