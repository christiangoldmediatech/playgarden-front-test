import { useAccessorHelper } from '@/composables/helpers.composable'
import { computed } from '@nuxtjs/composition-api'

export const useModal = () => {
  const store = useAccessorHelper().notifications

  const isEmailConflictModalVisible = computed({
    get() {
      return store.isEmailConflictModalVisible
    },

    set(isEmailConflictModalVisible: boolean) {
      store.SET_IS_EMAIL_CONFLICT_MODAL_VISIBLE(isEmailConflictModalVisible)
    }
  })

  const isAccountInactiveModalVisible = computed({
    get() {
      return store.isAccountInactiveModalVisible
    },

    set(isAccountInactiveModalVisible: boolean) {
      store.SET_IS_ACCOUNT_INACTIVE_MODAL_VISIBLE(isAccountInactiveModalVisible)
    }
  })

  return {
    isEmailConflictModalVisible,
    isAccountInactiveModalVisible
  }
}
