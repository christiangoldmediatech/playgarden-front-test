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
  }
}
