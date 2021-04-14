import { snotifyError } from '@/utils/vuex'

export default {
  async login ({ commit, dispatch, getters }, data) {
    try {
      const response = await this.$axios.post('/auth/login', data)

      dispatch('auth/setToken', response.data.accessToken, { root: true })
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! Wrong email or password.'
      })
    }
  }
}
