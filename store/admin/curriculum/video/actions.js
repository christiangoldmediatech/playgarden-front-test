export default {
  deleteVideoByLessonId (_, { id, lessonId }) {
    return this.$axios.$delete(`/lessons/${lessonId}/videos/${id}`)
  },

  fetchVideosByLessonId (_, { lessonId, params }) {
    return this.$axios.$get(`/lessons/${lessonId}/videos`, { params })
  },

  updateVideoByLessonId (_, { id, lessonId, data }) {
    return this.$axios.$patch(`/lessons/${lessonId}/videos/${id}`, data)
  }
}
