export default {
  getCurrentLessonByChildrenId (_, params) {
    return this.$axios.$get('/lessons-childrens/current', {
      params
    })
  },

  setCurrentLessonVideo ({ commit }, video) {
    commit('SET_CURRENT_LESSON_VIDEO', video)
  }
}
