import dayjs from 'dayjs'
import { computed } from '@nuxtjs/composition-api'
import { useAuth } from '@/composables'
import { hasLocalStorage } from '@/utils/window'
import { Store } from 'vuex/types'
import { TypedStore, UserFlow } from '@/models'
import { useShippingAddress } from './use-shipping-address.composable'

const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

export const useNotification = ({ store }: { store: Store<TypedStore> }) => {
  const { userInfo, isUserLoggedIn } = useAuth({ store })
  const { getShippingAdress } = useShippingAddress()

  const userFlow = computed(() => userInfo.value.flow)

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

  const isTrialEndingWeekTwoModalVisible = computed(() => store.state.notifications.isTrialEndingWeekTwoModalVisible)
  const setIsTrialEndingWeekTwoModalVisible = (isVisible: boolean) => {
    store.commit('notifications/SET_IS_TRIAL_ENDING_WEEK_TWO_MODAL_VISIBLE', isVisible)
  }

  const isTrialEndingWeekThreeModalVisible = computed(() => store.state.notifications.isTrialEndingWeekThreeModalVisible)
  const setIsTrialEndingWeekThreeModalVisible = (isVisible: boolean) => {
    store.commit('notifications/SET_IS_TRIAL_ENDING_WEEK_THREE_MODAL_VISIBLE', isVisible)
  }

  const isTrialEndingWeekFourModalVisible = computed(() => store.state.notifications.isTrialEndingWeekFourModalVisible)
  const setIsTrialEndingWeekFourModalVisible = (isVisible: boolean) => {
    store.commit('notifications/SET_IS_TRIAL_ENDING_WEEK_FOUR_MODAL_VISIBLE', isVisible)
  }

  const isTrialEndingPlanSelectedModalVisible = computed(() => store.state.notifications.isTrialEndingPlanSelectedModalVisible)
  const setIsTrialEndingPlanSelectedModalVisible = (isVisible: boolean) => {
    store.commit('notifications/SET_IS_TRIAL_ENDING_PLAN_SELECTED_MODAL_VISIBLE', isVisible)
  }

  const isTrialEndingForLastDayModalVisible = computed(() => store.state.notifications.isTrialEndingForLastDayModalVisible)
  const setIsTrialEndingForLastDayModalVisible = (isVisible: boolean) => {
    store.commit('notifications/SET_IS_TRIAL_ENDING_FOR_LAST_DAY_MODAL_VISIBLE', isVisible)
  }

  const isPlanUpgradeModalVisible = computed(() => store.state.notifications.isPlanUpgradeModalVisible)
  const setIsPlanUpgradeModalVisible = (isVisible: boolean) => {
    store.commit('notifications/SET_IS_PLAN_UPGRADE_MODAL_VISIBLE', isVisible)
  }

  const isCreditCardModalVisible = computed(() => store.state.notifications.isCreditCardModalVisible)
  const setIsCreditCardModalVisible = (isVisible: boolean) => {
    store.commit('notifications/SET_IS_CREDIT_CARD_MODAL_VISIBLE', isVisible)
  }

  const isEmailConflictModalVisible = computed(() => store.state.notifications.isEmailConflictModalVisible)
  const setIsEmailConflictModalVisible = (isVisible: boolean) => {
    store.commit('notifications/SET_IS_EMAIL_CONFLICT_MODAL_VISIBLE', isVisible)
  }

  const isAccountInactiveModalVisible = computed(() => store.state.notifications.isAccountInactiveModalVisible)
  const setIsAccountInactiveModalVisible = (isVisible: boolean) => {
    store.commit('notifications/SET_IS_ACCOUNT_INACTIVE_MODAL_VISIBLE', isVisible)
  }

  const isCanceledTrialModalVisible = computed(() => store.state.notifications.isCanceledTrialModalVisible)
  const setIsCanceledTrialModalVisible = (isVisible: boolean) => {
    store.commit('notifications/SET_IS_CANCELED_TRIAL_MODAL_VISIBLE', isVisible)
  }

  /**
   * Show a notification prompting the user to update their shipping address if:
   * - The user doesn't have the shipping address on file and it is a parent.
   */
  const checkUserShippingAddressAndNotify = async () => {
    if (userInfo.value.stripeStatus === 'active') {
      setIsShippingModalVisible(false)
      return
    }

    if (!isUserLoggedIn.value || userInfo.value.role.id !== 3) {
      setIsShippingModalVisible(false)
      return
    }

    const shippingAddress = await getShippingAdress()

    if (shippingAddress) {
      return
    }

    const workbookReminderDate = hasLocalStorage()
      ? JSON.parse(window.localStorage.getItem('pg-workbook-reminder') ?? 'null')
      : null

    const shouldShowShippingModal = workbookReminderDate
      ? dayjs().isAfter(dayjs.unix(workbookReminderDate), 'seconds')
      : true

    if (shouldShowShippingModal) {
      setIsShippingModalVisible(true)
    }
  }

  const showShippinAddressModalAgain = (boolean = false) => {
    if (hasLocalStorage()) {
      if (boolean) {
        window.localStorage.setItem('pg-workbook-reminder', dayjs().add(12, 'hours').unix().toString())
      } else {
        window.localStorage.setItem('pg-workbook-reminder', dayjs().add(70, 'years').unix().toString())
      }
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
      setIsTrialExpiringRibbonVisible(false)
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
      setIsTrialExpiredModalVisible(false)
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

  const showTrialEndingWeekTwoModal = () => {
    const showDays = [7, 9, 11, 13]
    const userCreatedAt = userInfo.value.createdAt
    const now = dayjs()

    const shouldShowTrialEndingWeekTwoModal = showDays.some((day) => {
      const userDayToBeNotified = dayjs(userCreatedAt).add(day, 'days')
      return now.isSame(userDayToBeNotified, 'day')
    })

    if (shouldShowTrialEndingWeekTwoModal) {
      setIsTrialEndingWeekTwoModalVisible(true)
    }
  }

  const showTrialEndingWeekThreeModal = () => {
    const showDays = [14, 16, 18, 20]
    const userCreatedAt = userInfo.value.createdAt
    const now = dayjs()

    const shouldShowTrialEndingWeekThreeModal = showDays.some((day) => {
      const userDayToBeNotified = dayjs(userCreatedAt).add(day, 'days')
      return now.isSame(userDayToBeNotified, 'day')
    })

    if (shouldShowTrialEndingWeekThreeModal) {
      setIsTrialEndingWeekThreeModalVisible(true)
    }
  }

  const showTrialEndingWeekFourModal = () => {
    const showDays = [21, 22, 23, 24, 25, 26, 27]
    const userCreatedAt = userInfo.value.createdAt
    const now = dayjs()

    const shouldShowTrialEndingWeekFourModal = showDays.some((day) => {
      const userDayToBeNotified = dayjs(userCreatedAt).add(day, 'days')
      return now.isSame(userDayToBeNotified, 'day')
    })

    if (shouldShowTrialEndingWeekFourModal) {
      setIsTrialEndingWeekFourModalVisible(true)
    }
  }

  const showTrialEndingModalForLastDay = async () => {
    if (!isUserLoggedIn.value) {
      setIsTrialEndingForLastDayModalVisible(false)
      return
    }

    const userCreatedAt = userInfo.value.createdAt
    const isPayingUser = userInfo.value.stripeStatus === 'active'
    const now = dayjs()
    const userChosePlan = userInfo.value.planChoosen || false
    const hasCreditCardsInFile = (await store.dispatch('payment/fetchBillingCards'))?.length > 0

    if (userFlow.value === UserFlow.CREDITCARD) {
      // Should appaear from the day 28th, to the next day the trial has ended.
      // If a plan has been chosen, it should not appear anymore.
      const showFromDay = dayjs(userCreatedAt).add(28, 'days').startOf('day')
      const showToDay = dayjs(userInfo.value?.trialEnd).add(1, 'day').endOf('day')

      // @ts-ignore
      if (dayjs().isBetween(showFromDay, showToDay, 'day', '[]') && !userChosePlan) {
        setIsTrialEndingForLastDayModalVisible(true)
      }
    } else {
      // Should appear from the 28th until the stripe status for the user is active.
      const userDayToBeNotified = dayjs(userCreatedAt).add(28, 'days').startOf('day')

      if ((now.isSame(userDayToBeNotified, 'day') || now.isAfter(userDayToBeNotified, 'day')) && !isPayingUser && !userChosePlan && !hasCreditCardsInFile) {
        setIsTrialEndingForLastDayModalVisible(true)
      }
    }
  }

  // Only show the trial ending modal to users that have some value in userInfo.value.subscription.discount
  const shouldShowTrialEndingModal = () => {
    if (!userInfo.value.subscription) {
      return false
    }
    const userSubscription = userInfo.value.subscription
    const userSubscriptionDiscount = userSubscription?.discount
    const hasCoupon = Boolean(userSubscriptionDiscount)
    return !hasCoupon
  }

  const handleTrialEndingFlow = async () => {
    if (userFlow.value === UserFlow.NOCREDITCARD) {
      showTrialEndingWeekTwoModal()
      showTrialEndingWeekThreeModal()
      showTrialEndingWeekFourModal()
    }

    if (shouldShowTrialEndingModal()) {
      await showTrialEndingModalForLastDay()
    }
  }

  return {
    checkIfShouldSendShippingAddressNotification,
    checkIfShouldShowTrialExpiredModal,
    checkIfShouldShowTrialExpiringRibbon,
    checkUserShippingAddressAndNotify,
    expiringRibbonHeightDesktop,
    expiringRibbonHeightMobile,
    handleTrialEndingFlow,
    isCreditCardModalVisible,
    isPlanUpgradeModalVisible,
    isShippingModalVisible,
    isTrialEndingForLastDayModalVisible,
    isTrialExpiredModalVisible,
    isTrialExpiringRibbonVisible,
    notificationCard,
    setIsCreditCardModalVisible,
    setIsPlanUpgradeModalVisible,
    setIsShippingModalVisible,
    setIsTrialEndingForLastDayModalVisible,
    setIsTrialEndingPlanSelectedModalVisible,
    setIsTrialExpiringRibbonVisible,
    setNotificationCard,
    showShippinAddressModalAgain,
    isEmailConflictModalVisible,
    setIsEmailConflictModalVisible,
    isAccountInactiveModalVisible,
    setIsAccountInactiveModalVisible,
    isCanceledTrialModalVisible,
    setIsCanceledTrialModalVisible
  }
}
