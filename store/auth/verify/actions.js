import { snotifyError } from '@/utils/vuex'

export default {
  async resentEmail ({ commit }) {
    try {
      const response = await this.$axios.get('/auth/resend/verification')

      return response.data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while sending your Verification email!'
      })

      throw new Error(error)
    }
  },

  async validateRegister ({ commit }, token) {
    try {
      const response = await this.$axios.get(`/auth/verify/email/${token}`)

      return response.data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while verifying your email!'
      })

      throw new Error(error)
    }
  }
}
