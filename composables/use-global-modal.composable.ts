
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
  isWeekFour: Boolean,
  isSubscriptionPlan: Boolean
}

const isContactUsModalVisible = ref(false)

// Trialing User Signup Notification
const isNotificationSignupModalVisible = ref(true)
const isWeekTwoAndThree = ref(false)
const isWeekFour = ref(false)
const isSubscriptionPlan = ref(false)
const imagePath = ref('')

export const useGlobalModal = ({ store }: { store: Store<TypedStore> }) => {
  const userInfo = store.getters['auth/getUserInfo']

  const isNotification = computed<TrialingUserSignupNotificationSign>(() => {
    const dataNotification: TrialingUserSignupNotificationSign = {
      imagePath: '',
      isNotificationSignupModalVisible: false,
      isWeekTwoAndThree: false,
      isWeekFour: false,
      isSubscriptionPlan: false
    }

    if (userInfo.flow === UserFlow.NOCREDITCARD) {
      let notificationShow: string | null = null
      let lastDateNotification: string | null = null

      if (hasLocalStorage()) {
        notificationShow = window.localStorage.getItem('notificationSignup')
        lastDateNotification = window.localStorage.getItem('lastDateNotification')
      }

      const week = getWeek(userInfo.createdAt)
      const day = (lastDateNotification) ? getDays(new Date(lastDateNotification)) : 0
      const showNotification = (notificationShow) || 'false'

      if (week >= 2 && week <= 3) {
        isWeekTwoAndThree.value = true
        if (hasLocalStorage()) {
          localStorage.setItem('notificationSignup', 'false')
        }
      }
      if (week >= 4) {
        isWeekFour.value = true
        if (hasLocalStorage()) {
          localStorage.setItem('notificationSignup', 'false')
        }
      }

      if ((showNotification === 'true' && isWeekTwoAndThree.value) || (showNotification === 'true' && isWeekFour.value)) {
        hideNotificationSignupModal()
      } else {
        showNotificationSignupModal()
      }

      // Show on Week 2 per two days And Show Week 4 per day
      if ((isWeekTwoAndThree.value && day === 2) || (isWeekFour.value && day === 1)) {
        showNotificationSignupModal()
      }

      // Show on Week 3 per day
      if ((isWeekTwoAndThree.value && day === 1 && week === 3)) {
        showNotificationSignupModal()
      }

      if (!lastDateNotification) {
        showNotificationSignupModal()
      }

      imagePath.value = getImagePath(week)
      dataNotification.isNotificationSignupModalVisible = showModal(day, notificationShow)
      dataNotification.isWeekTwoAndThree = isWeekTwoAndThree.value
      dataNotification.isWeekFour = isWeekFour.value
      dataNotification.imagePath = imagePath.value
      dataNotification.isSubscriptionPlan = isSubscriptionPlan.value
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

  const showSubscriptionPlanSelectionModal = () => {
    isNotificationSignupModalVisible.value = false
    isSubscriptionPlan.value = true
  }

  const hideSubscriptionPlanSelectionModal = () => {
    isSubscriptionPlan.value = false
  }

  return {
    isContactUsModalVisible,
    isNotification,
    showContactUsModal,
    hideContactUsModal,
    showNotificationSignupModal,
    hideNotificationSignupModal,
    showSubscriptionPlanSelectionModal,
    hideSubscriptionPlanSelectionModal
  }
}

function saveDataNotification () {
  if (hasLocalStorage()) {
    localStorage.setItem('notificationSignup', 'true')
    localStorage.setItem('lastDateNotification', dayjs().format('YYYY-MM-DD'))
  }
}

function getWeek (lastDate: Date) {
  const dateSplit = lastDate.toString().split('T')
  const now = new Date()
  const week = dayjs(now).diff(dateSplit[0], 'week')
  return week
}

function getDays (lastDate: Date) {
  const now = new Date()
  return (dayjs(now).diff(lastDate, 'days') + 1)
}

function showModal (day: Number, notificationShow: String | null) {
  let showModal = true
  if (notificationShow === 'true' && day === 1) {
    showModal = false
  }
  return showModal
}

function getImagePath (week: number) {
  let path = require('@/assets/svg/boy.svg')

  if (week > 1 && week <= 3) {
    path = require('@/assets/svg/children-play.svg')
  }

  if (week >= 4) {
    path = require('@/assets/svg/girl.svg')
  }
  return path
}
