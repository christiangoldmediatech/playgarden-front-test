export default {

  updatePlan (_, { id, data }) {
    return this.$axios.$patch(`/plans/${id}`, data)
  }

}
