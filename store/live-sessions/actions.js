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
  },

  async getUserLiveSessions ({ commit }, { monday, friday }) {
    try {
      let data
      const { total, liveSessions } = data = await this.$axios.$get('/live-sessions', {
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
  },

  async getRecorded (_, { curriculumTypeId = null, activityTypeId = null }) {
    try {
      const data = await this.$axios.$get('/live-sessions', {
        params: {
          limit: 100,
          page: 1,
          recorded: true,
          activityTypeId,
          curriculumTypeId
        }
      })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async saveAttendance (_, id) {
    await this.$axios.post(`/live-sessions/${id}/assistant`)
  }
}
