export default {
  async getCountries({ commit }) {
    try {
      const data = await this.$axios.$get('/countries')

      commit('SET_COUNTRIES', data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
