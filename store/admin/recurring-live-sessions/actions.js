import { snotifyError } from '@/utils/vuex'

export default {
  createRecurringLiveSession (_, data) {
    return this.$axios.$post('recurring-meetings', data)
  },

  async createLiveClasses ({ commit }, id) {
    try {
      commit('SET_CREATING_LIVE_CLASSES', true)
      await this.$axios.$get(`/crons/live-sessions?id=${id}`)
      commit('SET_CREATING_LIVE_CLASSES', false)
      commit('SET_SHOW_LIVE_CLASSES_CREATED', true)
    } catch (error) {
      commit('SET_CREATING_LIVE_CLASSES', false)
      return Promise.reject(error)
    }
  },

  deleteRecurringLiveSession (_, id) {
    return this.$axios.$delete(`recurring-meetings/${id}`)
  },

  getRecurringLiveSessions ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('recurring-meetings', { params })
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
    return this.$axios.$patch(`recurring-meetings/${id}`, data)
  },

  async getUserRecurringLiveSessions ({ commit }, { monday, friday }) {
    try {
      let data
      const { total, liveSessions } = data = await this.$axios.$get('recurring-meetings', {
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
