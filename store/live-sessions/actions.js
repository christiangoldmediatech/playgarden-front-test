import { snotifyError } from '@/utils/vuex'
import { getTimezone } from '@/utils/dateTools'

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

  getLiveSessions({ commit }, params) {
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

  async getUserLiveSessions ({ commit, rootGetters }, { sunday, saturday, admin, type }) {
    try {
      let data, meetings, total

      const params = {
        limit: 100,
        page: 1,
        type: 'LiveClass',
        startDate: sunday,
        endDate: saturday
      }

      if (!admin) {
        params.active = true
      }

      const { total: totalData, meetings: meetingsList, block } = data = await this.$axios.$get('/live-sessions', {
        params
      })

      total = totalData
      meetings = meetingsList

      const playdates = await this.$axios.$get('/live-sessions/show-children', {
        params: {
          page: params.limit,
          limit: params.page,
          startDate: params.startDate,
          endDate: params.endDate,
          type: 'Playdate',
          includeActivityType: true
        }
      })

      if (type !== 'liveClasses') {
        meetings.push(...playdates)
      }

      if (type === 'playdates') {
        meetings = meetings.filter((x) => x.type === 'Playdate')
        total = meetings.length
      }

      const userInfo = rootGetters['auth/getUserInfo']
      const timezone = (userInfo.timezone) ? userInfo.timezone : 'America/New_York'
      const currentTimezone = getTimezone(timezone)
      commit('SET_SESSIONS', meetings)
      commit('SET_TIMEZONE', currentTimezone)
      commit('SET_TOTAL', total)
      commit('SET_BLOCK', block)
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
          type: 'LiveClass',
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
  },

  async fetchHolidays ({ commit }, { sunday, saturday }) {
    try {
      const formattedSunday = sunday.toISOString().split('T')[0]
      const formattedSaturday = saturday.toISOString().split('T')[0]
      const response = await this.$axios.$get('/holidays', { params: { dateIntervalStart: formattedSunday, dateIntervalEnd: formattedSaturday } })
      commit('SET_HOLIDAYS', response)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
