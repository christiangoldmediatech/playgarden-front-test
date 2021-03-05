export default {
  acceptInvitePlaydate (_, token) {
    return this.$axios.$get(`/playdates/accept/invite/${token}`)
  },

  addChildren (_, { id, data }) {
    return this.$axios.$post(`/playdates/${id}`, data)
  },

  deletePlaydateInvitation (_, token) {
    return this.$axios.$delete(`/playdates/invite/${token}`)
  },

  getPlaydateInvite (_, token) {
    return this.$axios.$get(`/playdates/invite/${token}`)
  },

  getAndFilterPlaydates (_, params) {
    return this.$axios.$get('/playdates', { params })
  },

  getChildrenInfo () {
    return this.$axios.$get('/playdates/children')
  },

  getPlaydateDays () {
    return this.$axios.$get('/playdates/days/available')
  },

  joinPlaydate (_, { playdateId, childId }) {
    return this.$axios.$post(`/playdates/${playdateId}/add/children/${childId}`)
  },

  deleteChildren (_, { playdateId, childId }) {
    return this.$axios.$delete(`/playdates/${playdateId}/remove/children/${childId}`)
  }
}
