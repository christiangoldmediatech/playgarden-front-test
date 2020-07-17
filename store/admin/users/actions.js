export default {

  async get ({ commit }, params) {
    const data = await this.$axios.$get(`${process.env.apiBaseUrl}/users`, { params })
    commit('SET_USERS', data.users)
    commit('SET_FILTERED', data.filtered)
    commit('SET_LIMIT', data.limit)
    commit('SET_TOTAL', data.total)
    commit('SET_PAGE', data.page)
  },

  async getById (ctx, id) {
    const data = await this.$axios.$get(`${process.env.apiBaseUrl}/users/${id}`)
    return data
  },

  async create (ctx, data) {
    await this.$axios.$post(`${process.env.apiBaseUrl}/users`, data)
  },

  async update (ctx, { id, data }) {
    await this.$axios.$patch(`${process.env.apiBaseUrl}/users/${id}`, data)
  },

  async delete (ctx, id) {
    await this.$axios.$delete(`${process.env.apiBaseUrl}/users/${id}`)
  }
}