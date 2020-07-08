export default {

  async get ({ commit }, name = null) {
    const data = await this.$axios.$get(`${process.env.apiBaseUrl}/curriculum-types`, {
      params: {
        name
      }
    })
    commit('setRows', data)
  },

  async create (ctx, data) {
    await this.$axios.$post(`${process.env.apiBaseUrl}/curriculum-types`, data)
  },

  async update (ctx, { id, data }) {
    await this.$axios.$patch(`${process.env.apiBaseUrl}/curriculum-types/${id}`, data)
  },

  async delete (ctx, id) {
    await this.$axios.$delete(`${process.env.apiBaseUrl}/curriculum-types/${id}`)
  }
}
