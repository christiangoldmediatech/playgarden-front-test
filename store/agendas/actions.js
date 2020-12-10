export default {
  async getAgendas ({ commit }, params) {
    const data = await this.$axios.$get('/agendas', {
      params
    })
    commit('SET_ROWS', data)
    // commit('SET_FILTERED', data.filtered)
    commit('SET_LIMIT', data.length)
    commit('SET_TOTAL', data.length)
    // commit('SET_PAGE', data.page)

    return data
  },

  async getAgendaById (ctx, id) {
    const data = await this.$axios.$get(`/agendas/${id}`)
    return data
  },

  async createAgenda (ctx, data) {
    return await this.$axios.$post('/agendas', data)
  },

  async updateAgenda (ctx, { id, data }) {
    await this.$axios.$patch(`/agendas/${id}`, data)
  },

  async deleteAgenda (ctx, id) {
    await this.$axios.$delete(`/agendas/${id}`)
  }

}
