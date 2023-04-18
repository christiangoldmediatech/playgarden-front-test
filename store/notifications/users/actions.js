import { toastError } from '@/utils/vuex'

export default {
  getNotificationUsers ({ commit }) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('/notifications/users/list')
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting notifications.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },

  updateNotificationUser (_, id) {
    return this.$axios.$post(`notifications/users/${id}/toggle`)
  },

  updateNotificationSMS (_, id) {
    return this.$axios.$post(`notifications/users/${id}/sms/toggle`)
  },

  updateNotificationEmail (_, id) {
    return this.$axios.$post(`notifications/users/${id}/email/toggle`)
  }
}
