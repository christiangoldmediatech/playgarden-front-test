export default {

  updatePlan (_, { id, data }) {
    return this.$axios.$patch(`/plans/${id}`, data)
  },

  getPlanInfo (_, id) {
    return this.$axios.$get(`/plans/${id}`)
  },

  recordCancelPlanReason (_, data) {
    return this.$axios.$post('/plans/cancellation/reason', data)
  },

  async fetchLatestCancellationReason({ commit }) {
    const latestReason = await this.$axios.$get('/plans/cancellation/latest')

    commit('SET_LATEST_CANCELLATION_REASON', latestReason)

    return latestReason
  },

  async setLatestCancellationReason(_, data) {
    return await this.$axios.$patch('/plans/cancellation/flow', data)
  }

}
