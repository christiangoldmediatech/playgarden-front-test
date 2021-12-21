export default {
  getCourseProgressByChildId(_, { id, curriculumTypeId = null }) {
    return this.$axios.$get(
      `/children/${id}/progress${
        curriculumTypeId ? `/${curriculumTypeId}` : ''
      }`
    )
  }
}
