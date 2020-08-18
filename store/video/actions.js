export default {
  async getFavorites (ctx, childrenId) {
    try {
      const { data } = await this.$axios.get(`/videos-favorites/children/${childrenId}`)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async getAllFavorites ({ commit, dispatch, rootGetters }) {
    try {
      const results = []
      const promises = []
      rootGetters.getCurrentChild.forEach((child) => {
        promises.push(dispatch('getFavorites', child.id))
      })
      const response = await Promise.all(promises)
      response.forEach((resultSet) => {
        resultSet.forEach((video) => {
          results.push(video)
          // const index = results.findIndex(({ id }) => id === video.id)
          // if (index === -1) {
          //   results.push(video)
          // }
        })
      })
      commit('SET_ROWS', results)
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
