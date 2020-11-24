export default {
  createFAQs (_, data) {
    return this.$axios.$post('/faqs', data)
  },

  deleteFAQs (_, id) {
    return this.$axios.$delete(`/faqs/${id}`)
  },

  getFAQs (_, params) {
    return this.$axios.$get('/faqs', { params })
  },

  updateFAQs (_, { id, data }) {
    return this.$axios.$patch(`/faqs/${id}`, data)
  }
}
