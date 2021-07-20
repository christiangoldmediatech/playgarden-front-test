import dayjs from 'dayjs'
import { computed, ref } from '@nuxtjs/composition-api'
import { useAuth } from '@/composables'
import { hasLocalStorage } from '@/utils/window'
import { Store } from 'vuex/types'
import { TypedStore } from '@/models'
import { useShippingAddress } from './use-shipping-address.composable'

export const useNotification = ({ store }: { store: Store<TypedStore> }) => {
  const { userInfo, isUserLoggedIn } = useAuth({ store })
  const { getShippingAdress } = useShippingAddress()

  const expiringRibbonHeightDesktop = computed(() => store.state.notifications.expiringRibbonHeightDesktop)
  const expiringRibbonHeightMobile = computed(() => store.state.notifications.expiringRibbonHeightMobile)

  const isTrialExpiringRibbonVisible = computed(() => store.state.notifications.isTrialExpiringRibbonVisible)
  const setIsTrialExpiringRibbonVisible = (isVisible: boolean) => {
    store.commit('notifications/SET_TRIAL_EXPIRING_RIBBON_VISIBLE', isVisible)
  }

  const isTrialExpiredModalVisible = computed(() => store.state.notifications.isTrialExpiredModalVisible)
  const setIsTrialExpiredModalVisible = (isVisible: boolean) => {
    store.commit('notifications/SET_TRIAL_EXPIRED_MODAL_VISIBLE', isVisible)
  }

  const isShippingModalVisible = computed(() => store.state.notifications.isShippingModalVisible)
  const setIsShippingModalVisible = (isVisible: boolean) => {
    store.commit('notifications/SET_IS_SHIPPING_MODAL_VISIBLE', isVisible)
  }

  const notificationCard = computed(() => store.state.notifications.notificationCard)
  const setNotificationCard = (payload: Partial<typeof notificationCard.value>) => {
    store.commit('notifications/SET_NOTIFICATION_CARD', payload)
  }

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
      setNotificationCard({
        isVisible: true,
        title: 'WE WANT TO SEND YOU A WELCOME KIT!',
        description: 'We require a shipping address in order to send the Welcome Kit with our first Workbook.',
        action: () => {
          setIsShippingModalVisible(true)
        },
        image: require('@/assets/png/megaphone.png'),
        actionText: 'To learn more'
      })
    } else {
      setIsShippingModalVisible(true)
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
    const threeDaysInMinutes = dayInMinutes * 3
    const timeLeftInMinutes = dayjs(userInfo.value.trialEnd).diff(now, 'minute')

    if (timeLeftInMinutes > 0 && timeLeftInMinutes <= threeDaysInMinutes) {
      setIsTrialExpiringRibbonVisible(true)
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
      setIsTrialExpiredModalVisible(true)
    }
  }

  return {
    notificationCard,
    isTrialExpiredModalVisible,
    isTrialExpiringRibbonVisible,
    expiringRibbonHeightDesktop,
    expiringRibbonHeightMobile,
    isShippingModalVisible,
    setNotificationCard,
    setIsTrialExpiringRibbonVisible,
    checkUserShippingAddressAndNotify,
    checkIfShouldSendShippingAddressNotification,
    checkIfShouldShowTrialExpiringRibbon,
    checkIfShouldShowTrialExpiredModal
  }
}
