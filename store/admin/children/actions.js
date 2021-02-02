export default {
  getChildrensProgress (_, params) {
    return this.$axios.$get('/children/progress/list', { params })
  }
}
