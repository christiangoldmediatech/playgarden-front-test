export default {
  getPrivacyPolicy () {
    return this.$axios.$get('/configurations/privacy')
  },

  updatePrivacyPolicy (_, data) {
    return this.$axios.$patch('/configurations/privacy', data)
  }
}
