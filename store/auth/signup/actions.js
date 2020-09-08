import { snotifyError } from '@/utils/vuex'

export default {
  async signup ({ commit, dispatch }, data) {
    try {
      const response = await this.$axios.post('/auth/signup', data)

      return dispatch('auth/setToken', response.data.accessToken, {
        root: true
      })
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while signing you up.'
      })

      throw error
    }
  },

  async signupEmail ({ commit, dispatch }, data) {
    try {
      const { accessToken } = await this.$axios.$post('/auth/email', data)

      await dispatch('auth/setToken', accessToken, {
        root: true
      })

      return dispatch('auth/fetchUserInfo', null, { root: true })
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while signing you up.'
      })

      throw error
    }
  },

  async signupToken ({ commit, dispatch }, data) {
    try {
      const response = await this.$axios.post('/auth/signup/token', data)

      await dispatch('auth/setToken', response.data.accessToken, {
        root: true
      })

      return dispatch('auth/fetchUserInfo', null, { root: true })
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while signing you up.'
      })

      throw error
    }
  }
}
