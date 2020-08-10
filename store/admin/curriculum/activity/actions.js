export default {
  createActivityByLessonId (_, { activityId, lessonId }) {
    return this.$axios.$post(`/lessons/${lessonId}/activities/${activityId}`)
  },

  deleteActivityByLessonId (_, { id, lessonId }) {
    return this.$axios.$delete(`/lessons/${lessonId}/activities/${id}`)
  },

  fetchActivitiesByLessonId (_, { lessonId }) {
    return this.$axios.$get(`/lessons/${lessonId}/activities`)
  }
}
