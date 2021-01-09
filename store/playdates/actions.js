export default {
  addChildren (_, { id, data }) {
    return this.$axios.$post(`/playdates/${id}`, data)
  },

  getAndFilterPlaydates (_, params) {
    return this.$axios.$get('/playdates', { params })
  },

  getChildrenInfo () {
    return this.$axios.$get('/playdates/children')
  }
}
