import { snotifyError } from '@/utils/vuex'

export default {
  async signup ({ commit, dispatch, getters }, data) {
    try {
      const response = await this.$axios.post('/auth/signup', data)

      dispatch('auth/setToken', response.data.accessToken, { root: true })
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while signing you up.'
      })
    }
  }
}
