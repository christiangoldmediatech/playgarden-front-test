export default {

  async get ({ commit }, params) {
    const data = await this.$axios.$get('/specialists', { params })
    commit('SET_SPECIALISTS', data.specialists)
    commit('SET_FILTERED', data.filtered)
    commit('SET_LIMIT', data.limit)
    commit('SET_TOTAL', data.total)
    commit('SET_PAGE', data.page)
  },

  async getById (ctx, id) {
    const data = await this.$axios.$get(`/specialists/${id}`)
    return data
  },

  async create (ctx, data) {
    await this.$axios.$post('/specialists', data)
  },

  async update (ctx, { id, data }) {
    await this.$axios.$patch(`/specialists/${id}`, data)
  },

  async delete (ctx, id) {
    await this.$axios.$delete(`/specialists/${id}`)
  }
}
