export default {
  getCourseProgressByChildId (_, { id }) {
    return this.$axios.$get(`/children/${id}/progress`)
  }
}
