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

/*
export default {
  async getLiveSessions ({ commit }) {
    try {
      const today = new Date()
      const monday = new Date()
      const friday = new Date()

      if (today === 6 || today === 0) {
        // Get next week
        monday.setDate(today.getDate() + (7 - today.getDay()) % 7 + 1)
        friday.setDate(today.getDate() + (7 - today.getDay()) % 7 + 5)
      } else {
        // Get current week
        monday.setDate(today.getDate() - (today.getDay() - 1))
        friday.setDate(today.getDate() - (today.getDay() - 5))
      }

      monday.setHours(0, 0, 0, 0)
      friday.setHours(23, 59, 59, 999)

      let data
      const { total, liveSessions } = data = await this.$axios.$get('/live-sessions', {
        params: {
          limit: 100,
          page: 1,
          dateStart: monday,
          dateEnd: friday
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
*/
