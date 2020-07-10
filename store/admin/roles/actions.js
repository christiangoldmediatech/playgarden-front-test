export default {

  async get ({ commit }, name = null) {
    const data = await this.$axios.$get(`${process.env.apiBaseUrl}/roles`, { params: { name } })
    commit('SET_ROLES', data)
  },

  async create (ctx, data) {
    await this.$axios.$post(`${process.env.apiBaseUrl}/roles`, data)
  },

  async update (ctx, { id, data }) {
    await this.$axios.$patch(`${process.env.apiBaseUrl}/roles/${id}`, data)
  },

  async delete (ctx, id) {
    await this.$axios.$delete(`${process.env.apiBaseUrl}/roles/${id}`)
  }
}
