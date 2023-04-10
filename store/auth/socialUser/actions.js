import { toastError } from '@/utils/vuex'
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
  },

  async authSyncSocial ({ commit, dispatch }, data) {
    try {
      const response = await this.$axios.post('/auth/sync/social', data)
      return response
    } catch (error) {
      toastError(commit, {
        body: 'The synchronization with the social network cannot be completed because the emails do not match.',
        config: { timeout: 8000 }
      })
    }
  }
}
