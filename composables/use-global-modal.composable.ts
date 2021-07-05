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
    localStorage.setItem('notificationSignup', 'true')
    isNotificationSignupModalVisible.value = false
  }

  const fetchUserInfo = async () => {
    const { data } = await axios.get('/auth/me')
    userInfo.value = data
    const week = getWeek(userInfo.value)
    const showNotification = window.localStorage.getItem('notificationSignup')
    if (showNotification) {
      hideNotificationSignupModal()
    } else {
      showNotificationSignupModal()
    }
    isWeekTwoAndThree.value = (week === 1 || week === 2)
    isWeekFour.value = (week >= 3)
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

function getWeek (user: User) {
  const week = dayjs(new Date()).diff(user.createdAt, 'week')
  return week
}

function getImagePath (week: number) {
  const path = (week <= 2) ? require('@/assets/svg/girl.svg') : require('@/assets/svg/girl.svg')
  return path
}
