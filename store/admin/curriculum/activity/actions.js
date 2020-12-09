export default {
  createActivityByLessonId (_, { activityId, lessonId, order }) {
    return this.$axios.$post(`/lessons/${lessonId}/activities/${activityId}/${order}`)
  },

  updateActivityByLessonId (_, { idCurrent, activityId, lessonId, order }) {
    return this.$axios.$patch(`/lessons/${lessonId}/activities/${idCurrent}/${activityId}/${order}`)
  },

  deleteActivityByLessonId (_, { id, lessonId }) {
    return this.$axios.$delete(`/lessons/${lessonId}/activities/${id}`)
  },

  fetchActivitiesByLessonId (_, { lessonId }) {
    return this.$axios.$get(`/lessons/${lessonId}/activities`)
  }
}
