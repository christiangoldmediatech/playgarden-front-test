import { snotifyError } from '@/utils/vuex'

export default {
  /*
   * CARDS
   */
  async addBillingCard ({ commit }, data) {
    try {
      const response = await this.$axios.post('/billing/card', data)

      return response.data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while adding your Credit Card!'
      })
    }
  },

  async fetchBillingCards ({ commit }) {
    try {
      const { data } = await this.$axios.get('/billing/cards')

      return data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while getting your Subscription data!'
      })
    }
  },

  async removeBillingCard ({ commit }, id) {
    try {
      await this.$axios.delete(`/billing/card/${id}`)
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while removing your Credit Card!'
      })
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
    }
  },

  /*
   * SUBSCRIPTIONS
   */
  async cancelSubscription ({ commit }) {
    try {
      const { data } = await this.$axios.post('/billing/subscription/cancel')

      return data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while canceling your Subscription!'
      })
    }
  },

  async fetchBillingDetails ({ commit }) {
    try {
      const { data } = await this.$axios.get('/billing')

      return data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while getting your Subscription cost!'
      })
    }
  },

  async fetchSubscriptionCost ({ commit }) {
    try {
      const response = await this.$axios.get('/billing/cost')

      return response.data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while getting your Subscription cost!'
      })
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
    }
  }
}
