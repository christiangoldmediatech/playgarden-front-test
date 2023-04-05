import { toastError } from '@/utils/vuex'

export default {
  forgotUserPassword ({ commit }, { email, phone }) {
    if (email) {
      return this.$axios.$post('/auth/password/forget/email', { email })
    }

    return this.$axios.$post('/auth/password/forget/phone', { phone })
  },

  async updateUserPassword ({ commit }, draft) {
    try {
      await this.$axios.patch('/auth/password/change', draft)
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while updating your password!'
      })
    }
  }
}
