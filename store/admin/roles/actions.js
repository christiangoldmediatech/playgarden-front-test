export default {

  async get ({ commit }, name = null) {
    const data = await this.$axios.$get('/roles', { params: { name } })
    commit('SET_ROLES', data)
  },

  async create (ctx, data) {
    await this.$axios.$post('/roles', data)
  },

  async update (ctx, { id, data }) {
    await this.$axios.$patch(`/roles/${id}`, data)
  },

  async delete (ctx, id) {
    await this.$axios.$delete(`/roles/${id}`)
  }
}
