export default {
  async getPlaydates ({ commit }, params) {
    const data = await this.$axios.$get('/live-sessions', {
      params
    })
    commit('SET_ROWS', data)
    // commit('SET_FILTERED', data.filtered)
    commit('SET_LIMIT', data.length)
    commit('SET_TOTAL', data.length)
    // commit('SET_PAGE', data.page)

    return data
  },

  async getPlaydatesById (ctx, id) {
    return await this.$axios.$get(`/live-sessions/${id}`)
  },

  async createPlaydate (ctx, data) {
    return await this.$axios.$post('/live-sessions', data)
  },

  async updatePlaydate (ctx, { id, data }) {
    await this.$axios.$patch(`/live-sessions/${id}`, data)
  },

  async deletePlaydate (ctx, id) {
    await this.$axios.$delete(`/live-sessions/${id}`)
  }

}
