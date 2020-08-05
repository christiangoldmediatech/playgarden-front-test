export default {
  createWorksheetByLessonId (_, { lessonId, data }) {
    return new Promise((resolve, reject) =>
      this.$axios
        .post(`/lessons/${lessonId}/worksheets`, data)
        .then(({ data }) => resolve(data))
        .catch(reject)
    )
  },

  deleteWorksheetByLessonId (_, { id, lessonId }) {
    return new Promise((resolve, reject) =>
      this.$axios
        .delete(`/lessons/${lessonId}/worksheets/${id}`)
        .then(resolve)
        .catch(reject)
    )
  },

  fetchWorksheetsByLessonId (_, { lessonId, params, type }) {
    return new Promise((resolve, reject) =>
      this.$axios
        .get(`/lessons/${lessonId}/worksheets/${type}`, { params })
        .then(({ data }) => resolve(data))
        .catch(reject)
    )
  },

  updateWorksheetByLessonId (_, { id, lessonId, data }) {
    return new Promise((resolve, reject) =>
      this.$axios
        .patch(`/lessons/${lessonId}/worksheets/${id}`, data)
        .then(({ data }) => resolve(data))
        .catch(reject)
    )
  }
}
