export default {
  createFAQsCategory (_, data) {
    return this.$axios.$post('/faqs-categories', data)
  },

  deleteFAQsCategory (_, id) {
    return this.$axios.$delete(`/faqs-categories/${id}`)
  },

  getFAQsCategories (_, params) {
    return this.$axios.$get('/faqs-categories', { params })
  },

  updateFAQsCategory (_, { id, data }) {
    return this.$axios.$patch(`/faqs-categories/${id}`, data)
  }
}
