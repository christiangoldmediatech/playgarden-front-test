import { computed } from '@nuxtjs/composition-api'
import { UseAuthOptions } from './types'

export const useAuth = ({ store }: UseAuthOptions) => {
  const isUserLoggedIn = computed<boolean>(() => store.isUserLoggedIn)

  return {
    isUserLoggedIn
  }
}
