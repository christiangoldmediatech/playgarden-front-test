import { Console } from 'console'
import dayjs from 'dayjs'
import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { User } from '@/models'
// import { useAuth } from '@/composables'

const isContactUsModalVisible = ref(false)
const isNotificationSignupModalVisible = ref(true)
const isWeekTwoAndThree = ref(false)
const isWeekFour = ref(false)
const imagePath = ref('')
const userInfo = ref({} as User)

export const useGlobalModal = () => {
  // const { userInfo } = useAuth()

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

  const fetchUserInfo = () => {
    const lastDateNotification = window.localStorage.getItem('lastDateNotification')
    const notificationShow = window.localStorage.getItem('notificationSignup')
    const week = (lastDateNotification) ? getWeek(new Date(lastDateNotification)) : 0
    const day = (lastDateNotification) ? getDays(new Date(lastDateNotification)) : 0
    const showNotification = (notificationShow) || 'false'
    isWeekTwoAndThree.value = (day > 2)
    isWeekFour.value = (day > 1)
    console.log('notificationShow', notificationShow)
    console.log('day', day)
    console.log('week', week)
    if ((showNotification === 'true' && isWeekTwoAndThree.value) || (showNotification === 'true' && isWeekFour.value)) {
      hideNotificationSignupModal()
    } else {
      showNotificationSignupModal()
    }
    imagePath.value = getImagePath(week)
  }

  return {
    isContactUsModalVisible,
    isNotificationSignupModalVisible,
    isWeekTwoAndThree,
    isWeekFour,
    imagePath,
    showContactUsModal,
    hideContactUsModal,
    showNotificationSignupModal,
    hideNotificationSignupModal,
    fetchUserInfo
  }
}

function saveDataNotification () {
  localStorage.setItem('notificationSignup', 'true')
  localStorage.setItem('lastDateNotification', dayjs().format('YYYY-MM-DD'))
}

function getWeek (lastDate: Date) {
  const week = dayjs(new Date()).diff(lastDate, 'week')
  return week
}

function getDays (lastDate: Date) {
  const days = dayjs(new Date()).diff(lastDate, 'day')
  return days
}

function getImagePath (week: number) {
  const path = (week <= 2) ? require('@/assets/svg/girl.svg') : require('@/assets/svg/girl.svg')
  return path
}
