import { snotifyError } from '@/utils/vuex'

export default {
  createLiveSession (_, data) {
    return this.$axios.$post('/live-sessions', data)
  },

  deleteLiveSession (_, id) {
    return this.$axios.$delete(`/live-sessions/${id}`)
  },

  getLiveSessions ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('/live-sessions', { params })
        .then(resolve)
        .catch((error) => {
          snotifyError(commit, {
            body: 'Sorry! There was an error while getting Live Sessions.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },

  updateLiveSession (_, { id, data }) {
    return this.$axios.$patch(`/live-sessions/${id}`, data)
  }
}