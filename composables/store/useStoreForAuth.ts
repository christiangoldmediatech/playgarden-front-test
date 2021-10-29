import { computed } from '@nuxtjs/composition-api'
import { Store } from 'vuex'
import { User } from '@/models'

export const useStoreForAuth = ({ store }: { store: Store<unknown> }) => {
  // Store API Calls
  const userInfo = computed((): User | null => {
    if (store.getters['auth/getUserInfo'] === {}) { return null }
    return store.getters['auth/getUserInfo']
  })

  return {
    userInfo
  }
}
