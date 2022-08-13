import { computed } from '@nuxtjs/composition-api'
import { User } from './types'
import { UseUserOptions } from './types/use-user-options.type'

export const useUser = ({ store }: UseUserOptions) => {
  const userInfo = computed(() => store.userInfo)

  function getUserInfo (): Promise<User | undefined> {
    return store.fetchUserInfo()
  }

  function setPlanChoosen (): Promise<void> {
    return store.setPlanChoosen()
  }

  return {
    userInfo,
    getUserInfo,
    setPlanChoosen
  }
}
