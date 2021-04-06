export default {

  async getTypes ({ commit }, name = null) {
    const data = await this.$axios.$get('/report-card-types', { params: { name } })
    // commit('SET_TYPES', data)
    return data
  },

  async createType (ctx, data) {
    await this.$axios.$post('/report-card-types', data)
  },

  async updateType (ctx, { id, data }) {
    await this.$axios.$patch(`/report-card-types/${id}`, data)
  },

  async deleteType (ctx, id) {
    await this.$axios.$delete(`/report-card-types/${id}`)
  }
}
