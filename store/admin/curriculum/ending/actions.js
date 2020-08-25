export default {
  updateEndingByLessonId (_, { lessonId, data }) {
    return this.$axios.$patch(`/lessons/${lessonId}/ending`, data)
  }
}
