export default {

  async getTypes ({ commit }, name = null) {
    const data = await this.$axios.$get('/curriculum-types', { params: { name } })
    commit('SET_TYPES', data)
  },

  async createType (ctx, data) {
    await this.$axios.$post('/curriculum-types', data)
  },

  async updateType (ctx, { id, data }) {
    await this.$axios.$patch(`/curriculum-types/${id}`, data)
  },

  async deleteType (ctx, id) {
    await this.$axios.$delete(`/curriculum-types/${id}`)
  }
}
