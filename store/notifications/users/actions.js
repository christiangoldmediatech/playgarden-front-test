import { toastError } from '@/utils/vuex'

export default {
  async getNotificationUsers ({ commit }) {
    try {
      const data = await this.$axios.$get('/notifications/users/list')

      commit('SET_NOTIFICATIONS', data)

      return data
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while getting notifications.'
      })
    }
  },

  updateNotificationUser (_, id) {
    return this.$axios.$post(`notifications/users/${id}/toggle`)
  },

  updateNotificationSMS (_, id) {
    return this.$axios.$post(`notifications/users/${id}/sms/toggle`)
  },

  async updateNotificationEmail ({ commit }, id) {
    const data = await this.$axios.$post(`notifications/users/${id}/email/toggle`)

    commit('TOGGLE_EMAIL_NOTIFICATION', id)

    return data
  }
}
