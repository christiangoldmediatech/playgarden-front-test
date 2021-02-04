export default {
  getChildrenProgress () {
    return this.$axios.get('/children/progress/list')
  },

  getChildrenProgressExport () {
    return this.$axios.get('/children/progress/export')
  }
}
