
export default {
  async login({ dispatch }, data) {
    const response = await this.$axios.post('/auth/login', data)
    dispatch('auth/setToken', response.data.accessToken, { root: true })
  }
}
