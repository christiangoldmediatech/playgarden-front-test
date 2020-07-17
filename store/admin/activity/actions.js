export default {

  async getTypes ({ commit }, name = null) {
    const data = await this.$axios.$get('/activity-types', { params: { name } })
    commit('SET_TYPES', data)
  },

  async createType (ctx, data) {
    await this.$axios.$post('/activity-types', data)
  },

  async updateType (ctx, { id, data }) {
    await this.$axios.$patch(`/activity-types/${id}`, data)
  },

  async deleteType (ctx, id) {
    await this.$axios.$delete(`/activity-types/${id}`)
  }
}
