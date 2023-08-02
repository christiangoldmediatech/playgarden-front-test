export default {
  getCourseProgressByChildId(_, { id, curriculumTypeId = null }) {
    const isIdArray = Array.isArray(id)
    const idToSend = isIdArray ? id[0] : id

    return this.$axios.$get(
      `/children/${idToSend}/progress${
        curriculumTypeId ? `/${curriculumTypeId}` : ''
      }`, {
        params: {
          childrenIds: isIdArray ? id : [id]
        }
      }
    )
  },

  getPlayAndLearnProgressByChildId(_, { id }) {
    return this.$axios.$get(`/children/${id}/progress/play-and-learn`)
  }
}
