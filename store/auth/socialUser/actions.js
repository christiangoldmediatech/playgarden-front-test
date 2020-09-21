export default {
  async authLoginSocial ({ commit, dispatch }, data) {
    try {
      const response = await this.$axios.post('/auth/login/social', data)
      dispatch('auth/setToken', response.data.accessToken, { root: true })
      return { ...response, statusCode: response.status }
    } catch (error) {
      return error.response.data
    }
  }
}
