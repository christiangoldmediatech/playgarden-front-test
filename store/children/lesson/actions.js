export default {
  async getCurrentLessonByChildrenId ({ commit }, params) {
    const { lesson } = await this.$axios.$get('/lessons/childrens/current', {
      params
    })

    commit('admin/curriculum/SET_LESSON', lesson, { root: true })

    return lesson
  },

  setCurrentLessonVideo ({ commit }, video) {
    commit('SET_CURRENT_LESSON_VIDEO', video)
  },

  async saveVideoProgress (ctx, { lessonId, childId, video }) {
    try {
      const { data } = await this.$axios.$post(`/lessons/${lessonId}/children/${childId}/video`, { video })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async saveWorksheetProgress (ctx, { lessonId, childId, worksheet }) {
    try {
      const { data } = await this.$axios.$post(`/lessons/${lessonId}/children/${childId}/worksheets`, { worksheet })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
