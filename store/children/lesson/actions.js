export default {
  async resetChild (ctx, { lessonId, childId }) {
    const { data } = await this.$axios.delete(`/lessons/${lessonId}/children/${childId}`)
    return data
  },

  async getCurrentLessonByChildrenId ({ commit }, { lessonId, childId }) {
    const { lesson } = await this.$axios.$get(`/lessons/${lessonId}/children/${childId}`)
    commit('admin/curriculum/SET_LESSON', lesson, { root: true })
    return lesson
  },

  async getCurrentLesson ({ commit }, params) {
    const { lesson } = await this.$axios.$get('/lessons/childrens/current', { params })
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
      const { data } = await this.$axios.$post(`/lessons/${lessonId}/children/${childId}/worksheet`, { worksheet })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async saveActivityProgres (ctx, { lessonId, childId, activity }) {
    try {
      const { data } = await this.$axios.$post(`/lessons/${lessonId}/children/${childId}/activity`, { activity })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
