export default {
  deleteVideoByLessonId (_, { id, lessonId }) {
    return new Promise((resolve, reject) =>
      this.$axios
        .delete(`/lessons/${lessonId}/videos/${id}`)
        .then(resolve)
        .catch(reject)
    )
  },

  fetchVideosByLessonId (_, { lessonId, params }) {
    return new Promise((resolve, reject) =>
      this.$axios
        .get(`/lessons/${lessonId}/videos`, { params })
        .then(({ data }) => resolve(data))
        .catch(reject)
    )
  },

  updateVideoByLessonId (_, { id, lessonId, data }) {
    return new Promise((resolve, reject) =>
      this.$axios
        .patch(`/lessons/${lessonId}/videos/${id}`, data)
        .then(({ data }) => resolve(data))
        .catch(reject)
    )
  }
}
