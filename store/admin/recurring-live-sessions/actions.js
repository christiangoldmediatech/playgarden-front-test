import { snotifyError } from '@/utils/vuex'

export default {
  createRecurringLiveSession (_, data) {
    return this.$axios.$post('recurring-live-sessions', data)
  },

  deleteRecurringLiveSession (_, id) {
    return this.$axios.$delete(`recurring-live-sessions/${id}`)
  },

  getRecurringLiveSessions ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('recurring-live-sessions', { params })
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

  updateRecurringLiveSession (_, { id, data }) {
    return this.$axios.$patch(`recurring-live-sessions/${id}`, data)
  },

  async getUserRecurringLiveSessions ({ commit }, { monday, friday }) {
    try {
      let data
      const { total, liveSessions } = data = await this.$axios.$get('recurring-live-sessions', {
        params: {
          limit: 100,
          page: 1,
          startDate: monday,
          endDate: friday
        }
      })
      commit('SET_SESSIONS', liveSessions)
      commit('SET_TOTAL', total)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
