export default {
  async createCategory(ctx, payload) {
    try {
      const data = await this.$axios.$post('/category/parents-corners', payload)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async fetchCategories({ commit }, params) {
    try {
      const data = await this.$axios.$get('/category/parents-corners', {
        params
      })
      commit('SET_CATEGORIES', data)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async updateCategory(ctx, { id, payload }) {
    try {
      const data = await this.$axios.$patch(
        `/category/parents-corners/${id}`,
        payload
      )
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async deleteCategory(ctx, id) {
    try {
      const data = await this.$axios.$delete(`/category/parents-corners/${id}`)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  /* Videos */
  async createVideo(ctx, payload) {
    try {
      const data = await this.$axios.$post('/parent-corners-videos', payload)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async fetchVideos({ commit }, params) {
    try {
      const data = await this.$axios.$get('/parent-corners-videos', { params })
      commit('SET_VIDEOS', data)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async updateVideo(ctx, { id, payload }) {
    try {
      const data = await this.$axios.$patch(
        `/parent-corners-videos/${id}`,
        payload
      )
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async deleteVideo(ctx, id) {
    try {
      const data = await this.$axios.$delete(`/parent-corners-videos/${id}`)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
