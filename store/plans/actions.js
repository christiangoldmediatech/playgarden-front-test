export default {

  updatePlan (_, { id, data }) {
    return this.$axios.$patch(`/plans/${id}`, data)
  },

  getPlanInfo (_, id) {
    return this.$axios.$get(`/plans/${id}`)
  },

  recordCancelPlanReason (_, data) {
    return this.$axios.$post('/users/cancellation/reason', data)
  },

  async fetchLatestCancellationReason({ commit }) {
    const latestReason = await this.$axios.$get('/users/cancellation/latest')

    commit('SET_LATEST_CANCELLATION_REASON', latestReason)

    return latestReason
  },

  async setLatestCancellationReason(_, data) {
    return await this.$axios.$patch('/users/cancellation/flow', data)
  }

}
