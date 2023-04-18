import { toastError } from '@/utils/vuex'

export default {
  /*
   * CARDS
   */
  async addBillingCard({ commit }, data) {
    try {
      return await this.$axios.$post('/billing/card', data)
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while adding your Credit Card!'
      })

      throw error
    }
  },

  async fetchBillingCards({ commit }) {
    try {
      return await this.$axios.$get('/billing/cards')
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while getting your Subscription data!'
      })

      throw error
    }
  },

  async removeBillingCard({ commit }, id) {
    try {
      return await this.$axios.$delete(`/billing/card/${id}`)
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while removing your Credit Card!'
      })

      throw error
    }
  },

  async updateBillingCard({ commit }, { id, data }) {
    return await this.$axios.$patch(`/billing/card/${id}`, data)
  },

  async validateCard({ commit }, data) {
    try {
      return await this.$axios.$post('/billing/validate/card', data)
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while validating your Credit Card!'
      })

      throw error
    }
  },

  /*
   * SUBSCRIPTIONS COST
   */
  async cancelSubscription({ commit }, reason = '') {
    try {
      return await this.$axios.$delete(
        `/billing/subscription/cancel?reason=${reason}`
      )
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while canceling your Subscription!'
      })

      throw error
    }
  },

  async cancelSubscriptionById({ commit }, id) {
    try {
      return await this.$axios.$delete(`/billing/subscription/${id}/cancel`)
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while canceling the Subscription!'
      })

      throw error
    }
  },

  async fetchBillingDetails({ commit }) {
    try {
      const response = await this.$axios.$get('/billing')
      commit('SET_BILLING', response)
      return response
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while getting your Subscription cost!'
      })

      throw error
    }
  },

  async fetchSubscriptionCost({ commit }) {
    try {
      return await this.$axios.$get('/billing/cost')
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while getting your Subscription cost!'
      })

      throw error
    }
  },

  async paySubscription({ commit }, data) {
    try {
      return await this.$axios.$post('/billing', data)
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while paying your Subscription!'
      })

      throw error
    }
  },

  async payShorterSubscription({ commit }, data) {
    try {
      return await this.$axios.$post('/billing/payment', data)
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while paying your Subscription!'
      })

      throw error
    }
  },

  /*
   * SUBSCRIPTIONS PLAN
   */
  fetchSubscriptionPlan({ commit }) {
    try {
      return this.$axios.$get('/plans')
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while getting Subscription plans!'
      })

      throw error
    }
  },

  fetchSubscriptionPlanById({ commit }, id) {
    try {
      return this.$axios.$get(`/plans/${id}`)
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while getting Subscription plans!'
      })

      throw error
    }
  },

  getSelectedSubscriptionPlan() {
    return this.$axios.$get('/auth/user/plan')
  },

  getSelectedSubscriptionPlanByUser(_, id) {
    return this.$axios.$get(`/users/${id}/plan`)
  },

  async selectSubscriptionPlan({ commit }, { id, type, ...data }) {
    try {
      return await this.$axios.$patch(`/auth/user/plan/${id}/${type}`, data)
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while setting your Subscription plan!'
      })

      throw error
    }
  }
}
