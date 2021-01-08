export default {

  async getGraphicByChildrenId ({ commit }, { childId }) {
    const data = await this.$axios.$get(`/progress-reports/graphic/${childId}`)
    commit('SET_REPORT', data)
  },

  async getLastLessonChildren (ctx, { childId }) {
    try {
      const data = await this.$axios.$get(`/progress-reports/lessons/${childId}`)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
