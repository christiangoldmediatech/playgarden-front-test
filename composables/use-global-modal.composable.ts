import { Console } from 'console'
import dayjs from 'dayjs'
import { computed, ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { User } from '@/models'
import { useAuth } from '@/composables'

const isContactUsModalVisible = ref(false)
const isNotificationSignupModalVisible = ref(true)
const isWeekTwoAndThree = ref(false)
const isWeekFour = ref(false)
const imagePath = ref('')

export const useGlobalModal = () => {
  // const { userInfo } = useAuth()
  // localStorage.setItem('notificationSignup', 'true')
  const isNotification = computed<any>(() => {
    const dataNotification: any = {}
    // const { data } = await axios.get('/auth/me')

    const notificationShow = window.localStorage.getItem('notificationSignup')
    const lastDateNotification = window.localStorage.getItem('lastDateNotification')
    const week = 1 // getWeek(data.createdAt)
    const day = (lastDateNotification) ? getDays(new Date(lastDateNotification)) : 0
    const showNotification = (notificationShow) || 'false'
    isWeekTwoAndThree.value = (week <= 2)
    isWeekFour.value = true // (week >= 2)
    // isNotificationSignupModalVisible.value = true // aqui

    if ((showNotification === 'true' && isWeekTwoAndThree.value) || (showNotification === 'true' && isWeekFour.value)) {
      hideNotificationSignupModal()
    } else {
      showNotificationSignupModal()
    }
    imagePath.value = getImagePath(week)
    dataNotification.imagePath = getImagePath(week)
    dataNotification.isNotificationSignupModalVisible = isNotificationSignupModalVisible.value
    dataNotification.isWeekTwoAndThree = isWeekTwoAndThree.value
    dataNotification.isWeekFour = isWeekFour.value
    dataNotification.imagePath = imagePath.value

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
    showContactUsModal,
    hideContactUsModal,
    showNotificationSignupModal,
    hideNotificationSignupModal
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
