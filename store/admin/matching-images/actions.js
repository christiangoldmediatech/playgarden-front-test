export default {
  createMatchingImage (_, data) {
    try {
      return this.$axios.$post('/matching-images', data)
    } catch (error) {
      throw new Error(error)
    }
  },

  deleteMatchingImage (_, id) {
    return this.$axios.$delete(`/matching-images/${id}`)
  },

  getMatchingImageById (_, id) {
    return this.$axios.$get(`/matching-images/${id}`)
  },

  fetchMatchingImages (_, params) {
    return this.$axios.$get('/matching-images', { params })
  },

  updateMatchingImage (_, { id, data }) {
    try {
      return this.$axios.$patch(`/matching-images/${id}`, data)
    } catch (error) {
      throw new Error(error)
    }
  }
}
