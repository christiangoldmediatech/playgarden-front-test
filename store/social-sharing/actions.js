export default {
  createSocialSharing (_, data) {
    return this.$axios.$post('/social-sharings', data)
  },

  getSocialSharingById (_, id) {
    return this.$axios.$get(`/social-sharings/${id}`)
  }
}
