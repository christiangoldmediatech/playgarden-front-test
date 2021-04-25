import { snotifyError } from '@/utils/vuex'

export default {
  createLiveSession (_, data) {
    return this.$axios.$post('/live-sessions', data)
  },

  deleteLiveSession (_, id) {
    return this.$axios.$delete(`/live-sessions/${id}`)
  },

  async getParticipants (_, id) {
    const participants = await this.$axios.$get(`/live-sessions/${id}/assistant`)
    return participants.map((data) => {
      const { user } = data
      user.fullName = `${user.firstName} ${user.lastName}`
      data.user = user
      return data
    })
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

  recoverLiveSession (_, id) {
    return this.$axios.$patch(`/live-sessions/${id}/recover`)
  },

  async getUserLiveSessions ({ commit }, { monday, friday, admin }) {
    try {
      let data
      const params = {
        limit: 100,
        page: 1,
        startDate: monday,
        endDate: friday
      }

      if (!admin) {
        params.active = true
      }
      const { total, liveSessions } = data = await this.$axios.$get('/live-sessions', {
        params
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
