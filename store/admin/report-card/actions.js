export default {

  async getTypes ({ commit }, name = null) {
    const data = await this.$axios.$get(`${process.env.apiBaseUrl}/report-card-types`, { params: { name } })
    commit('SET_TYPES', data)
  },

  async createType (ctx, data) {
    await this.$axios.$post(`${process.env.apiBaseUrl}/report-card-types`, data)
  },

  async updateType (ctx, { id, data }) {
    await this.$axios.$patch(`${process.env.apiBaseUrl}/report-card-types/${id}`, data)
  },

  async deleteType (ctx, id) {
    await this.$axios.$delete(`${process.env.apiBaseUrl}/report-card-types/${id}`)
  }
}
