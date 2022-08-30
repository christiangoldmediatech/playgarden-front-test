import { computed } from '@nuxtjs/composition-api'
import { useAccessorHelper } from '../helpers.composable'
import { PlanTier } from './types'

export const useAuth = () => {
  const store = useAccessorHelper().auth

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
