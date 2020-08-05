export default {
  updateEndingByLessonId (_, { lessonId, data }) {
    return new Promise((resolve, reject) =>
      this.$axios
        .patch(`/lessons/${lessonId}/ending`, data)
        .then(({ data }) => resolve(data))
        .catch(reject)
    )
  }
}
