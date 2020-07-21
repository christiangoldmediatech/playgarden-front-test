export default {

  async getActivities ({ commit }, { name = null, activityTypeId = null }) {
    const data = await this.$axios.$get('/activities', {
      params: {
        name,
        activityTypeId,
        type: 'VIDEO'
      }
    })
    commit('SET_ROWS', data)
    commit('SET_FILTERED', data.filtered)
    commit('SET_LIMIT', data.limit)
    commit('SET_TOTAL', data.total)
    commit('SET_PAGE', data.page)
  },

  async getActivityById (ctx, id) {
    const data = await this.$axios.$get(`/activities/${id}`)
    return data
  },

  async createActivity (ctx, data) {
    await this.$axios.$post('/activities', data)
  },

  async updateActivity (ctx, { id, data }) {
    await this.$axios.$patch(`/activities/${id}`, data)
  },

  async deleteActivity (ctx, id) {
    await this.$axios.$delete(`/activities/${id}`)
  },

  async getTypes ({ commit }, name = null) {
    const data = await this.$axios.$get('/activity-types', { params: { name } })
    commit('SET_TYPES', data)
  },

  async createType (ctx, data) {
    await this.$axios.$post('/activity-types', data)
  },

  async updateType (ctx, { id, data }) {
    await this.$axios.$patch(`/activity-types/${id}`, data)
  },

  async deleteType (ctx, id) {
    await this.$axios.$delete(`/activity-types/${id}`)
  }
}
