import dayjs from 'dayjs'
import { ref } from '@nuxtjs/composition-api'
import { useAuth } from '@/composables'
import { hasLocalStorage } from '@/utils/window'
import { useShippingAddress } from './use-shipping-address.composable'

const expiringRibbonHeightDesktop = ref(54) // update if ribbon content is modified
const expiringRibbonHeightMobile = ref(101) // update if ribbon content is modified
const isTrialExpiringRibbonVisible = ref(false)
const isTrialExpiredModalVisible = ref(false)
const isShippingModalVisible = ref(false)
const notificationCard = ref({
  isVisible: false,
  title: '',
  description: '',
  image: '',
  action: null as (() => void) | null,
  actionText: ''
})

export const useNotification = () => {
  const { userInfo, isUserLoggedIn } = useAuth()
  const { getShippingAdress } = useShippingAddress()

  /**
   * Show a notification prompting the user to update their shipping address if:
   * - The user doesn't have the shipping address on file and it is a parent.
   */
  const checkUserShippingAddressAndNotify = async () => {
    if (!isUserLoggedIn.value || userInfo.value.role.id !== 3) {
      return
    }

    const shippingAddress = await getShippingAdress()

    if (shippingAddress) {
      return
    }

    const didShowModalBefore = hasLocalStorage()
      ? JSON.parse(window.localStorage.getItem('seen:shipping-address-modal') || 'false')
      : false

    if (didShowModalBefore) {
      notificationCard.value = {
        isVisible: true,
        title: 'WE WANT TO SEND YOU A WELCOME KIT!',
        description: 'We require a shipping address in order to send the Welcome Kit with our first Workbook.',
        action: () => {
          isShippingModalVisible.value = true
        },
        image: require('@/assets/png/megaphone.png'),
        actionText: 'To learn more'
      }
    } else {
      isShippingModalVisible.value = true
    }
  }

  /**
   * When should we send the user the missing shipping address notification?
   * - The user logged in before or,
   * - the onboarding was completed or,
   * - twenty minutes has passed.
   */
  const checkIfShouldSendShippingAddressNotification = () => {
    // we'll consider it a user that logged in before if the created date is greater than a day
    const didLoginBefore = dayjs(new Date()).diff(userInfo.value.createdAt, 'days') >= 1

    if (isUserLoggedIn.value && didLoginBefore) {
      checkUserShippingAddressAndNotify()
      return
    }

    const onboardingDone = !!userInfo.value.onboardingDone

    if (isUserLoggedIn.value && onboardingDone) {
      checkUserShippingAddressAndNotify()
      return
    }

    const twentyMinutes = 1000 * 60 * 20

    setTimeout(() => {
      checkUserShippingAddressAndNotify()
    }, twentyMinutes)
  }

  /**
   * When should we show the user the trial expiring ribbon?
   * - There are 3 or less days of trial available
   */
  const checkIfShouldShowTrialExpiringRibbon = () => {
    if (!isUserLoggedIn.value) {
      return
    }

    const now = new Date()
    const dayInMinutes = 1440
    const threeDays = dayInMinutes * 3
    const timeLeft = dayjs(userInfo.value.trialEnd).diff(now, 'minute')

    if (timeLeft > 0 && timeLeft <= threeDays) {
      isTrialExpiringRibbonVisible.value = true
    }
  }

  /**
   * When should we show the user the trial expired modal?
   * - The user `trial_end` is lower than the current day,
   * - only one time, the next time they enter the platform,
   * - they are not a subscribed user and,
   * - they did not select a plan before
   */
  const checkIfShouldShowTrialExpiredModal = () => {
    if (!isUserLoggedIn.value) {
      return
    }

    const oneDay = 1
    const now = new Date()

    // user `trialEnd` is lower than the current day
    const didTrialEnd = dayjs(now).diff(userInfo.value.trialEnd, 'minutes') >= oneDay

    // we'll consider it a user that logged in before if the created date is greater than a day
    const didLoginBefore = dayjs(now).diff(userInfo.value.createdAt, 'minutes') >= oneDay

    const didChoosePlan = userInfo.value.planChoosen

    const subscription = userInfo.value.subscription
    const isSubscribedUser = subscription && subscription.status === 'active'

    const shouldShowExpiredModal =
      didTrialEnd &&
      didLoginBefore &&
      isSubscribedUser &&
      !didChoosePlan

    if (shouldShowExpiredModal) {
      isTrialExpiredModalVisible.value = true
    }
  }

  return {
    expiringRibbonHeightDesktop,
    expiringRibbonHeightMobile,
    checkUserShippingAddressAndNotify,
    checkIfShouldSendShippingAddressNotification,
    checkIfShouldShowTrialExpiringRibbon
  }
}
