export default {
  createWorksheetByLessonId (_, { lessonId, data }) {
    return this.$axios.$post(`/lessons/${lessonId}/worksheets`, data)
  },

  deleteWorksheetByLessonId (_, { id, lessonId }) {
    return this.$axios.$delete(`/lessons/${lessonId}/worksheets/${id}`)
  },

  fetchWorksheetsByLessonId (_, { lessonId, params, type }) {
    return this.$axios.$get(`/lessons/${lessonId}/worksheets/${type}`, {
      params
    })
  },

  updateWorksheetByLessonId (_, { id, lessonId, data }) {
    return this.$axios.$patch(`/lessons/${lessonId}/worksheets/${id}`, data)
  },

  createWorksheetLog (_, { lessonId, worksheetId, data }) {
    return this.$axios.$post(`/lessons/${lessonId}/worksheets/${worksheetId}`, data)
  }
}
