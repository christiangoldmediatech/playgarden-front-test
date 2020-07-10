import { snotifyError } from '@/utils/vuex'

export default {
  async fetchSubscriptionCost ({ commit }) {
    try {
      const response = await this.$axios.get('/billing/cost')

      return response.data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while getting your Subscription cost!'
      })

      throw new Error(error)
    }
  },

  async paySubscription ({ commit }, data) {
    try {
      const response = await this.$axios.post('/billing', data)

      return response.data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while paying your Subscription!'
      })

      throw new Error(error)
    }
  },

  async validateCard ({ commit }, data) {
    try {
      const response = await this.$axios.post('/billing/validate/card', data)

      return response.data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while validating your Credit Card!'
      })

      throw new Error(error)
    }
  }
}
