
import dayjs from 'dayjs'
import { computed, ref } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'
import { UserFlow, TypedStore } from '@/models'
import { hasLocalStorage } from '@/utils/window'

// Signup Notification for trialing users
type TrialingUserSignupNotificationSign = {
  imagePath: String
  isNotificationSignupModalVisible: Boolean
  isWeekTwoAndThree: Boolean
  isWeekFour: Boolean
}

const isContactUsModalVisible = ref(false)

// Trialing User Signup Notification
const isNotificationSignupModalVisible = ref(true)
const isWeekTwoAndThree = ref(false)
const isWeekFour = ref(false)
const imagePath = ref('')

export const useGlobalModal = ({ store }: { store: Store<TypedStore> }) => {
  const userInfo = store.getters['auth/getUserInfo']
  const isChangePasswordModalVisible = computed<boolean>(() => {
    const user = store.getters['auth/getUserInfo']
    return (user.firstLogin)
  })

  const isNotification = computed<TrialingUserSignupNotificationSign>(() => {
    const dataNotification: TrialingUserSignupNotificationSign = {
      imagePath: '',
      isNotificationSignupModalVisible: false,
      isWeekTwoAndThree: false,
      isWeekFour: false
    }

    if (userInfo.flow === UserFlow.NOCREDITCARD) {
      let lastDateNotification: string | null = null

      if (hasLocalStorage()) {
        lastDateNotification = window.localStorage.getItem('lastDateNotification')
      }

      const week = getWeek(userInfo.createdAt)
      const day = (lastDateNotification) ? getDays(lastDateNotification) : 0
      console.log('day--', day)

      if (week >= 2 && week <= 3) {
        isWeekTwoAndThree.value = true
      }
      if (week >= 4) {
        isWeekFour.value = true
      }

      if ((isWeekTwoAndThree.value && week === 2 && day > 2) || (isWeekTwoAndThree.value && week === 2 && day === 0)) {
        // week 2
        showNotificationSignupModal()
      } else if ((isWeekTwoAndThree.value && week === 3 && day > 1) || (isWeekTwoAndThree.value && week === 3 && day === 0)) {
        // week 3
        showNotificationSignupModal()
      } else if ((isWeekFour.value && week === 4 && day > 1) || (isWeekFour.value && week === 4 && day === 0)) {
        // week 4
        showNotificationSignupModal()
      } else {
        hideNotificationSignupModal()
      }

      imagePath.value = getImagePath(week)
      dataNotification.isNotificationSignupModalVisible = (getTrial(userInfo.trialEnd) === false) ? false : isNotificationSignupModalVisible.value
      dataNotification.isWeekTwoAndThree = isWeekTwoAndThree.value
      dataNotification.isWeekFour = isWeekFour.value
      dataNotification.imagePath = imagePath.value
    }
    return dataNotification
  })

  const showContactUsModal = () => {
    isContactUsModalVisible.value = true
  }
  const hideContactUsModal = () => {
    isContactUsModalVisible.value = false
  }

  const showNotificationSignupModal = () => {
    isNotificationSignupModalVisible.value = true
  }

  const hideNotificationSignupModal = () => {
    isNotificationSignupModalVisible.value = false
    saveDataNotification()
  }

  return {
    isContactUsModalVisible,
    isNotification,
    isChangePasswordModalVisible,
    showContactUsModal,
    hideContactUsModal,
    showNotificationSignupModal,
    hideNotificationSignupModal
  }
}

const saveDataNotification = () => {
  if (hasLocalStorage()) {
    localStorage.setItem('lastDateNotification', dayjs().add(1, 'day').format('YYYY-MM-DD'))
  }
}

const getWeek = (lastDate: Date) => {
  const now = new Date()
  let week = dayjs(now).diff(lastDate, 'days')
  if (week < 7) {
    week = 1
  } else if (week >= 7 && week < 14) {
    week = 2
  } else if (week >= 14 && week < 21) {
    week = 3
  } else {
    week = 4
  }
  return week
}

const getDays = (lastDate: string) => {
  const now = dayjs().format('YYYY-MM-DD')
  return dayjs(now).diff(lastDate, 'days')
}

const getTrial = (dateEnd: Date) => {
  const now = new Date()
  const isTrial = dayjs(dateEnd).isAfter(now)
  return isTrial
}

const getImagePath = (week: number) => {
  let path = require('@/assets/svg/boy.svg')

  if (week > 1 && week <= 3) {
    path = require('@/assets/svg/children-play.svg')
  }

  if (week >= 4) {
    path = require('@/assets/svg/girl.svg')
  }
  return path
}
