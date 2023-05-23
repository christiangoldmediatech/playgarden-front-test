import dayjs from 'dayjs'
import { computed } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { useToastHelper } from '@/composables'
import { useAccessorHelper } from '../helpers.composable'
import { User } from './types'

export const useUser = () => {
  const store = useAccessorHelper().auth
  const toast = useToastHelper()

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

  const setUserExpectDays = async (days: number) => {
    try {
      await axios.$patch('/users/days-expect-use', { dayExpectUse: days })
    } catch {
      toast.error('Could not set days')
    }
  }

  return {
    userInfo,
    isTrialExpired,
    lastDayOfTrial,
    trialEndedTooLongAgo,
    getUserInfo,
    setUserExpectDays,
    setPlanChoosen
  }
}
