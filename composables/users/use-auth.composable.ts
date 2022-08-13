import { computed } from '@nuxtjs/composition-api'
import { PlanTier, UseAuthOptions } from './types'

export const useAuth = ({ store }: UseAuthOptions) => {
  const isUserLoggedIn = computed(() => store.isUserLoggedIn)
  const isUserInTrial = computed(() => store.isUserInTrial)

  const isPlayAndLearnUser = computed(
    () => store.userInfo?.planSelected.id === PlanTier.LEARN_PLAY
  )

  return {
    isUserLoggedIn,
    isUserInTrial,
    isPlayAndLearnUser
  }
}
