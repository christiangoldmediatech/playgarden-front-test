export default {
  getDashboard (_, params) {
    return this.$axios.$get('/dashboard/data', { params })
  }
}
