export default {
  async authLoginSocial ({ dispatch }, data) {
    // eslint-disable-next-line no-useless-catch
    try {
      const { accessToken } = await this.$axios.$post(
        '/auth/login/social',
        data
      )

      await dispatch('auth/setToken', accessToken, {
        root: true
      })

      return dispatch('auth/fetchUserInfo', null, { root: true })
    } catch (error) {
      throw error
    }
  }
}
