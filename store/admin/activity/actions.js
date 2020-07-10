export default {

  async getTypes ({ commit }, name = null) {
    const data = await this.$axios.$get(`${process.env.apiBaseUrl}/activity-types`, { params: { name } })
    commit('SET_TYPES', data)
  },

  async createType (ctx, data) {
    await this.$axios.$post(`${process.env.apiBaseUrl}/activity-types`, data)
  },

  async updateType (ctx, { id, data }) {
    await this.$axios.$patch(`${process.env.apiBaseUrl}/activity-types/${id}`, data)
  },

  async deleteType (ctx, id) {
    await this.$axios.$delete(`${process.env.apiBaseUrl}/activity-types/${id}`)
  }
}
