import { computed } from '@nuxtjs/composition-api'
import { UseNotificationOptions } from './types'

export const useNotification = ({ store }: UseNotificationOptions) => {
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
