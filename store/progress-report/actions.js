export default {

  async getReport ({ commit }, name = null) {
    const data = await this.$axios.$get('/progress-reports', { params: { name } })
    commit('SET_REPORT', data)
  }
}
