import dayjs from 'dayjs'
import { snotifyError } from '@/utils/vuex'
import { hasLocalStorage } from '@/utils/window'
import { UserFlow } from '@/models'

export default {
  createNotification (_, data) {
    return this.$axios.$post('/notifications', data)
  },

  deleteNotification (_, id) {
    return this.$axios.$delete(`/notifications/${id}`)
  },

  restoreNotification (_, id) {
    return this.$axios.$patch(`/notifications/${id}/recover`)
  },

  getNotifications ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('/notifications', { params })
        .then(resolve)
        .catch((error) => {
          snotifyError(commit, {
            body: 'Sorry! There was an error while getting notifications.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },

  updateNotification (_, { id, data }) {
    return this.$axios.$patch(`/notifications/${id}`, data)
  },

  /**
   * When should we send the user the missing shipping address notification?
   * - The user logged in before or,
   * - the onboarding was completed or,
   * - twenty minutes has passed.
   */
  checkIfShouldSendShippingAddressNotification ({ dispatch, rootGetters }) {
    const isUserLoggedIn = rootGetters['auth/isUserLoggedIn']
    const userInfo = rootGetters['auth/getUserInfo']

    // we'll consider it a user that logged in before if the created date is greater than a day
    const didLoginBefore = dayjs(new Date()).diff(userInfo.createdAt, 'days') >= 1

    if (isUserLoggedIn && didLoginBefore) {
      dispatch('checkUserShippingAddressAndNotify')
      return
    }

    const onboardingDone = !!userInfo.onboardingDone

    if (isUserLoggedIn && onboardingDone) {
      dispatch('checkUserShippingAddressAndNotify')
      return
    }

    const twentyMinutes = 1000 * 60 * 20

    setTimeout(() => {
      dispatch('checkUserShippingAddressAndNotify')
    }, twentyMinutes)
  },

  /**
   * Show a notification prompting the user to update their shipping address if:
   * - The user doesn't have the shipping address on file and it is a parent.
   */
  async checkUserShippingAddressAndNotify ({ commit, dispatch, rootGetters }) {
    const isUserLoggedIn = rootGetters['auth/isUserLoggedIn']
    const userInfo = rootGetters['auth/getUserInfo']

    if (!isUserLoggedIn && userInfo.role.id !== 3) {
      return
    }

    const shippingAddress = await dispatch('shipping-address/getShippingAddress', undefined, { root: true })

    if (shippingAddress) {
      return
    }

    const shouldShowShippingModal = hasLocalStorage()
      ? JSON.parse(window.localStorage.getItem('pg-workbook-reminder')) ?? true
      : false

    if (shouldShowShippingModal) {
      commit('notifications/SET_IS_SHIPPING_MODAL_VISIBLE', true, { root: true })
    }
  },

  showShippingAddressModalAgain (_, boolean = false) {
    return hasLocalStorage()
      ? window.localStorage.setItem('pg-workbook-reminder', JSON.stringify(boolean))
      : undefined
  },

  /**
   * When should we show the user the trial expiring ribbon?
   * - There are 3 or less days of trial available
   */
  checkIfShouldShowTrialExpiringRibbon ({ commit, rootGetters }) {
    const isUserLoggedIn = rootGetters['auth/isUserLoggedIn']

    if (!isUserLoggedIn) {
      return
    }

    const userInfo = rootGetters['auth/getUserInfo']
    const now = new Date()
    const dayInMinutes = 1440
    const threeDays = dayInMinutes * 3
    const timeLeft = dayjs(userInfo.trialEnd).diff(now, 'minute')

    if (timeLeft > 0 && timeLeft <= threeDays) {
      commit('notifications/SET_TRIAL_EXPIRING_RIBBON_VISIBLE', true, { root: true })
    }
  },

  /**
   * When should we show the user the trial expired modal?
   * - The user `trial_end` is lower than the current day,
   * - only one time, the next time they enter the platform,
   * - they are not a subscribed user and,
   * - they did not select a plan before
   */
  async checkIfShouldShowTrialExpiredModal ({ commit, rootGetters }) {
    const isUserLoggedIn = rootGetters['auth/isUserLoggedIn']

    if (!isUserLoggedIn) {
      return
    }

    const userInfo = rootGetters['auth/getUserInfo']
    let cards = []
    if (userInfo.role.id === 3) {
      const { data } = await this.$axios.get('/billing/cards')
      cards = data
    }

    const oneDay = 1
    const now = new Date()

    // user `trialEnd` is lower than the current day
    const didTrialEnd = dayjs(now).diff(userInfo.trialEnd, 'minutes') >= oneDay

    // we'll consider it a user that logged in before if the created date is greater than a day
    const didLoginBefore = dayjs(now).diff(userInfo.createdAt, 'minutes') >= oneDay

    const subscription = userInfo.subscription
    let isSubscribedUser = subscription && subscription.status === 'active'

    let didChoosePlan = false

    if (userInfo.flow === UserFlow.NOCREDITCARD) {
      didChoosePlan = (cards.length > 0)
      isSubscribedUser = subscription && subscription.status === 'past_due'
    } else {
      didChoosePlan = userInfo.planChoosen
    }

    const shouldShowExpiredModal =
      didTrialEnd &&
      didLoginBefore &&
      isSubscribedUser &&
      !didChoosePlan

    if (shouldShowExpiredModal) {
      commit('notifications/SET_TRIAL_EXPIRED_MODAL_VISIBLE', true, { root: true })
    }

    return shouldShowExpiredModal
  }
}
