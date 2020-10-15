export default {
  async createCategory (ctx, payload) {
    try {
      const data = await this.$axios.$post('/category/parents-corners', payload)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async getCategories ({ commit }, params) {
    try {
      const data = await this.$axios.$get('/category/parents-corners', { params })
      commit('SET_CATEGORIES', data)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async updateCategory (ctx, { id, payload }) {
    try {
      const data = await this.$axios.$patch(`/category/parents-corners/${id}`, payload)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async deleteCategory (ctx, id) {
    try {
      const data = await this.$axios.$delete(`/category/parents-corners/${id}`)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
