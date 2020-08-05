export default {
  async store ({ commit }, data) {
    try {
      const response = await this.$axios.post('/children', data)

      return response.data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while storing.'
      })
    }
  },

  async get ({ commit }) {
    try {
      const { data } = await this.$axios.get('/children')
      commit('SET_ROWS', data)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async getById (ctx, id) {
    try {
      const { data } = await this.$axios.get(`/children/${id}`)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async update (ctx, { id, params }) {
    try {
      const { data } = await this.$axios.patch(`/children/${id}`, params)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async delete (ctx, id) {
    try {
      const { data } = await this.$axios.delete(`/children/${id}`)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
