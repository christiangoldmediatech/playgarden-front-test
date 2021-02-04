export default {
  async getActivities ({ commit }, params) {
    const data = await this.$axios.$get('/activities', {
      params
    })
    commit('SET_ROWS', data.activities)
    commit('SET_FILTERED', data.filtered)
    commit('SET_LIMIT', data.limit)
    commit('SET_TOTAL', data.total)
    commit('SET_PAGE', data.page)

    return data
  },

  async getActivityById (ctx, id) {
    return await this.$axios.$get(`/activities/${id}`)
  },

  async createActivity (ctx, data) {
    return await this.$axios.$post('/activities', data)
  },

  async updateActivity (ctx, { id, data }) {
    await this.$axios.$patch(`/activities/${id}`, data)
  },

  async deleteActivity (ctx, id) {
    await this.$axios.$delete(`/activities/${id}`)
  },

  async getTypes ({ commit }, params) {
    const { data } = await this.$axios.get('/activity-types', {
      params
    })
    commit('SET_TYPES', data)
    return data
  },

  async createType (ctx, data) {
    await this.$axios.$post('/activity-types', data)
  },

  async updateType (ctx, { id, data }) {
    await this.$axios.$patch(`/activity-types/${id}`, data)
  },

  async deleteType (ctx, id) {
    await this.$axios.$delete(`/activity-types/${id}`)
  },

  async getNextActivity (ctx, { prevActivityId, params = {} }) {
    try {
      const data = await this.$axios.$get(`/activities/${prevActivityId}/next`, { params })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
