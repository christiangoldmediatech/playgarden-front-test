export default {
  getDashboard (_, params) {
    return this.$axios.$get('/dashboard/data', { params })
  },

  getUserCharts (_) {
    return this.$axios.$get('/dashboard/data?totalSubscription=true&userPerPlan=true&userPerStatus=true')
  }
}
