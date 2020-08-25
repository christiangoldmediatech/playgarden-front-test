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
  }
}
