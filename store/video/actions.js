export default {
  async getFavorites ({ commit }, childrenId) {
    try {
      commit('SET_LOADING', true)
      const results = []
      const { data } = await this.$axios.get(`/videos-favorites/children/${childrenId}`)
      data.forEach((video) => {
        results.push(video)
      })
      commit('SET_ROWS', results)
      return data
    } catch (error) {
      return Promise.reject(error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async getAllFavorites ({ state, commit, dispatch, rootGetters }) {
    if (state.loading) { return }
    try {
      commit('SET_LOADING', true)
      const results = await this.$axios.$get('/videos-favorites/children')
      commit('SET_ROWS', results)
    } catch (error) {
      return Promise.reject(error)
    } finally {
      commit('SET_LOADING', false)
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
