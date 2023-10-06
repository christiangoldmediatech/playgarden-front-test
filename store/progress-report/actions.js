export default {

  async getGraphicByChildrenId ({ commit }, { childId, reportCardTypes }) {
    const data = await this.$axios.$post(`/progress-reports/graphic/${childId}`, reportCardTypes)
    commit('SET_REPORT', data)
  },

  async getLastLessonChildren (ctx, { childId, params }) {
    try {
      const data = await this.$axios.$get(`/progress-reports/lessons/${childId}`, { params })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async getAllProgressExport (ctx, { childId }) {
    try {
      return await this.$axios.$get(`/children/${childId}/progress/lessons/export`)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
