export default {
  getTermsConditions () {
    return this.$axios.$get('/configurations/terms')
  },

  updateTermsConditions (_, data) {
    return this.$axios.$patch('/configurations/terms-conditions', data)
  }
}
