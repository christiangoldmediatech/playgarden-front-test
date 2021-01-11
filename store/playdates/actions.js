export default {
  acceptInvitePlaydate (_, token) {
    return this.$axios.$get(`/playdates/accept/invite/${token}`)
  },

  addChildren (_, { id, data }) {
    return this.$axios.$post(`/playdates/${id}`, data)
  },

  getPlaydateInvite (_, token) {
    return this.$axios.$get(`/playdates/invite/${token}`)
  },

  getAndFilterPlaydates (_, params) {
    return this.$axios.$get('/playdates', { params })
  },

  getChildrenInfo () {
    return this.$axios.$get('/playdates/children')
  }
}
