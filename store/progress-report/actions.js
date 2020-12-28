export default {

  async getReport ({ commit }, name = null) {
    const data = await this.$axios.$get('/progress-reports', { params: { name } })
    commit('SET_REPORT', data)
  },

  async getDataLessonsReport (ctx, { childId }) {
    try {
      const data = await this.$axios.$get(`/progress-reports/lessons/${childId}`)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
