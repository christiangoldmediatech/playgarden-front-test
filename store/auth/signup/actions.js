import { snotifyError } from '@/utils/vuex'

export default {
  async signup ({ commit, dispatch, getters }, data) {
    const user = { ...data }

    if (user.password) {
      delete user.socialNetwork
      delete user.socialNetworkId
    } else {
      delete user.password
      delete user.passwordConfirmation
    }

    const utm = getters.getUtm

    const { accessToken } = await this.$axios.$post('/auth/signup', { ...user, ...utm })

    await dispatch('auth/setToken', accessToken, {
      root: true
    })

    return dispatch('auth/fetchUserInfo', null, { root: true })
  },

  signupEmail ({ commit, dispatch }, data) {
    return this.$axios.$post('/auth/email', data)
  },

  async signupToken ({ commit, dispatch }, data) {
    try {
      const { accessToken } = await this.$axios.$post(
        '/auth/signup/token',
        data
      )

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
  }
}
