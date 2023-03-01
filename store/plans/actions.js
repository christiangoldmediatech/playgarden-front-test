export default {

  updatePlan (_, { id, data }) {
    return this.$axios.$patch(`/plans/${id}`, data)
  },

  getPlanInfo (_, id) {
    return this.$axios.$get(`/plans/${id}`)
  },

  recordCancelPlanReason (_, data) {
    return this.$axios.$post('/plans/cancellation/reason', data)
  }

}
