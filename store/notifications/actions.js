import dayjs from 'dayjs'
import { snotifyError } from '@/utils/vuex'

export default {
  createNotification (_, data) {
    return this.$axios.$post('/notifications', data)
  },

  deleteNotification (_, id) {
    return this.$axios.$delete(`/notifications/${id}`)
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
   * - The user doesn't have the shipping address on file and is a parent.
   */
  async checkUserShippingAddressAndNotify ({ commit, dispatch, rootGetters }) {
    const isUserLoggedIn = rootGetters['auth/isUserLoggedIn']
    const userInfo = rootGetters['auth/getUserInfo']

    if (isUserLoggedIn && userInfo.role.id === 3) {
      const shippingAddress = await dispatch('shipping-address/getShippingAddress', undefined, { root: true })

      if (!shippingAddress) {
        commit('notifications/SET_NOTIFICATION_CARD', {
          title: 'WE WANT TO SEND YOU A WELCOME KIT!',
          description: 'We require a shipping address in order to send the Welcome Kit with our first Workbook.',
          action: () => commit('notifications/SET_IS_SHIPPING_MODAL_VISIBLE', true, { root: true }),
          image: require('@/assets/png/megaphone.png')
        }, { root: true })
      }
    }
  }
}
