import dayjs from 'dayjs'
import { computed, ref, useStore, useRouter, useRoute } from '@nuxtjs/composition-api'
import { UserFlow } from '@/models'
import { useSignup } from './use-signup.composable'

type NotificationSign = {
  imagePath: String
  isNotificationSignupModalVisible: Boolean
  isWeekTwoAndThree: Boolean
  isWeekFour: Boolean,
  isSubscriptionPlan: Boolean
}

const isContactUsModalVisible = ref(false)
const isNotificationSignupModalVisible = ref(true)
const isWeekTwoAndThree = ref(false)
const isWeekFour = ref(false)
const isSubscriptionPlan = ref(false)
const imagePath = ref('')

export const useGlobalModal = () => {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()
  const { abFlow } = useSignup({ router, route })
  const userInfo = store.getters['auth/getUserInfo']

  const isNotification = computed<NotificationSign>(() => {
    const dataNotification: NotificationSign = {
      imagePath: '',
      isNotificationSignupModalVisible: false,
      isWeekTwoAndThree: false,
      isWeekFour: false,
      isSubscriptionPlan: false
    }
    if (abFlow.value !== UserFlow.NOCREDITCARD) {
      const notificationShow = window.localStorage.getItem('notificationSignup')
      const lastDateNotification = window.localStorage.getItem('lastDateNotification')

      const week = getWeek(userInfo.createdAt)
      const day = (lastDateNotification) ? getDays(new Date(lastDateNotification)) : 0
      const showNotification = (notificationShow) || 'false'

      if (week >= 2 && week <= 3) {
        isWeekTwoAndThree.value = true
        localStorage.setItem('notificationSignup', 'false')
      }
      if (week >= 4) {
        isWeekFour.value = true
        localStorage.setItem('notificationSignup', 'false')
      }

      if ((showNotification === 'true' && isWeekTwoAndThree.value) || (showNotification === 'true' && isWeekFour.value)) {
        hideNotificationSignupModal()
      } else {
        showNotificationSignupModal()
      }

      if ((isWeekTwoAndThree.value && day > 14) || (isWeekFour.value && day > 1)) {
        showNotificationSignupModal()
      }

      if (!lastDateNotification) {
        showNotificationSignupModal()
      }

      imagePath.value = getImagePath(week)
      dataNotification.isNotificationSignupModalVisible = isNotificationSignupModalVisible.value
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
    isSubscriptionPlan.value = false
    saveDataNotification()
  }

  const showSubscriptionPlanSelectionModal = () => {
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
  localStorage.setItem('notificationSignup', 'true')
  localStorage.setItem('lastDateNotification', dayjs().format('YYYY-MM-DD'))
}

function getWeek (lastDate: Date) {
  const now = new Date()
  const week = dayjs(now).diff(lastDate, 'week')
  return week
}

function getDays (lastDate: Date) {
  const now = new Date()
  const days = dayjs(now).diff(lastDate, 'day')
  return days
}

function getImagePath (week: number) {
  const path = (week <= 2) ? require('@/assets/svg/girl.svg') : require('@/assets/svg/girl.svg')
  return path
}
