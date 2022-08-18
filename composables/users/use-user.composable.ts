import dayjs from 'dayjs'
import { computed } from '@nuxtjs/composition-api'
import { useAccessorHelper } from '../helpers.composable'
import { User } from './types'

export const useUser = () => {
  const store = useAccessorHelper().auth

  const userInfo = computed(() => store.userInfo)

  const isTrialExpired = computed<boolean>(() => {
    if (!userInfo.value?.trialEnd) {
      return true
    }

    return dayjs().isAfter(dayjs(userInfo.value.trialEnd))
  })

  const lastDayOfTrial = computed<string>(() => {
    if (!userInfo.value?.trialEnd) {
      return ''
    }

    return dayjs(userInfo.value.trialEnd).format('MMMM DD, YYYY')
  })

  const trialEndedTooLongAgo = computed<boolean>(() => {
    if (!userInfo.value?.trialEnd) {
      return true
    }

    const expiredMoreThan30DaysAgo =
      dayjs().diff(dayjs(userInfo.value.trialEnd)) > 30

    return isTrialExpired.value && expiredMoreThan30DaysAgo
  })

  function getUserInfo (): Promise<User | undefined> {
    return store.fetchUserInfo()
  }

  function setPlanChoosen (): Promise<void> {
    return store.setPlanChoosen()
  }

  return {
    userInfo,
    isTrialExpired,
    lastDayOfTrial,
    trialEndedTooLongAgo,
    getUserInfo,
    setPlanChoosen
  }
}
