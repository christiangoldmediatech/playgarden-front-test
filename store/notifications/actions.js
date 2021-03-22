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
   * Show a notification prompting the user to update their shipping address if:
   * - The user doesn't have the shipping address on file, and
   * - 2 days or more have past.
   */
  async checkUserShippingAddressAndNotify ({ commit, dispatch, rootGetters }) {
    const isUserLoggedIn = rootGetters['auth/isUserLoggedIn']
    const userInfo = rootGetters['auth/getUserInfo']

    if (isUserLoggedIn && userInfo.role.id === 3) {
      const shippingAddress = await dispatch('shipping-address/getShippingAddress', undefined, { root: true })

      if (!shippingAddress) {
        const createdAt = userInfo.createdAt
        const daysPastSinceCreation = dayjs(new Date()).diff(dayjs(createdAt), 'days')

        if (daysPastSinceCreation >= 2) {
          commit('notifications/SET_NOTIFICATION_CARD', {
            title: 'WE WANT TO SEND YOU A WELCOME KIT!',
            description: 'We require a shipping address in order to send the Welcome Kit with Backpack, workbooks, and additional materials.',
            action: () => commit('notifications/SET_IS_SHIPPING_MODAL_VISIBLE', true, { root: true }),
            image: require('@/assets/png/megaphone.png')
          }, { root: true })
        }
      }
    }
  }
}
