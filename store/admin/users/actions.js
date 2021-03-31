export default {

  async get ({ commit }, params) {
    const data = await this.$axios.$get('/users', { params })
    commit('SET_USERS', data.users)
    commit('SET_FILTERED', data.filtered)
    commit('SET_LIMIT', data.limit)
    commit('SET_TOTAL', data.total)
    commit('SET_PAGE', data.page)
  },

  async getById (ctx, id) {
    const data = await this.$axios.$get(`/users/${id}`)
    return data
  },

  async getChildren (ctx, id) {
    const data = await this.$axios.$get(`/user/${id}/children`)
    return data
  },

  async create (ctx, data) {
    await this.$axios.$post('/users', data)
  },

  async updateUserPlanByAdmin (ctx, data) {
    await this.$axios.$patch(`/users/${data.userId}/plan`, data)
  },

  async updateUserPasswordByAdmin (ctx, data) {
    await this.$axios.$patch(`/users/${data.id}/password`, data.data)
  },

  async exportParents (ctx) {
    await this.$axios.get('/billing/export')
  },

  async update (ctx, { id, data }) {
    await this.$axios.$patch(`/users/${id}`, data)
  },

  async delete (ctx, id) {
    await this.$axios.$delete(`/users/${id}`)
  }
}
