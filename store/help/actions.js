export default {
  sendHelpEmail (_, data) {
    return this.$axios.$post('/reporting-errors', data)
  }
}
