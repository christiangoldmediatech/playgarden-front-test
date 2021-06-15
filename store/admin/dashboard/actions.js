export default {
  getDashboard (_, params) {
    return this.$axios.$get('/dashboard/data', { params })
  },

  getUserCharts (_) {
    return this.$axios.$get('/dashboard/data?totalSubscription=true&userPerPlan=true&userPerStatus=true')
  },

  getDashboardAnalytics (_, data) {
    return this.$axios.$get(`/dashboard/lesson/${data.lessonId}/entityId/${data.entityId}`, { })
  },

  getWorksheetDashboardAnalytics (_, data) {
    return this.$axios.$get(`/dashboard/lesson/${data.lessonId}/worksheet/${data.entityId}`, { })
  }
}
