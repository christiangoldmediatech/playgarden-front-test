import { useAccessorHelper } from '@/composables/helpers.composable'
import { computed } from '@nuxtjs/composition-api'

export const useNotification = () => {
  const store = useAccessorHelper().notifications

  const isTrialExpiringRibbonVisible = computed({
    get() {
      return store.isTrialExpiringRibbonVisible
    },

    set(isTrialExpiringRibbonVisible: boolean) {
      store.SET_TRIAL_EXPIRING_RIBBON_VISIBLE(isTrialExpiringRibbonVisible)
    }
  })

  return {
    isTrialExpiringRibbonVisible
  }
}
