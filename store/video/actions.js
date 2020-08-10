export default {
  async getFavorites ({ commit }, params) {
    try {
      const { data } = await this.$axios.get('/videos-favorites', { params })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async addFavorite (ctx, params) {
    try {
      const { data } = await this.$axios.post('/videos-favorites', params)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async deleteFavorite (ctx, id) {
    try {
      const { data } = await this.$axios.delete(`/videos-favorites/${id}`)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
