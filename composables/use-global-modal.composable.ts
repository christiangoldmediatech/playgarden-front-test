import { ref } from '@nuxtjs/composition-api'

const isContactUsModalVisible = ref(false)

export const useGlobalModal = () => {
  const showContactUsModal = () => {
    isContactUsModalVisible.value = true
  }
  const hideContactUsModal = () => {
    isContactUsModalVisible.value = false
  }

  return {
    isContactUsModalVisible,
    showContactUsModal,
    hideContactUsModal
  }
}
