import { computed } from '@nuxtjs/composition-api'
import { Store } from 'vuex'
import dayjs from 'dayjs'
import { TypedStore } from '@/models'

type UseLearningKitsPopup = {
  store: Store<TypedStore>
}

const LEARNING_KITS_POPUP_STORAGE_KEY = 'learningKitsPopupShown'
export function useLearningKitsPopup({ store }: UseLearningKitsPopup) {
  const showLearningKitsPopup = computed(() => {
    if (localStorage.getItem(LEARNING_KITS_POPUP_STORAGE_KEY)) {
      return false
    }

    const user = store.getters['auth/getUserInfo']
    const registeredAt = user.planSelectedAt || user.createdAt
    if (!registeredAt) {
      return false
    }

    const diff = Math.round(dayjs().diff(registeredAt, 'days'))
    if (diff >= 3 && diff <= 7) {
      localStorage.setItem(LEARNING_KITS_POPUP_STORAGE_KEY, 'true')
      return true
    }

    return false
  })

  return showLearningKitsPopup
}
