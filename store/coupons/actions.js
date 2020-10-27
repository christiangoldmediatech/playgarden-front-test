import { snotifyError } from '@/utils/vuex'

export default {
  getCouponById (_, { id }) {
    return this.$axios.$get(`/coupons/${id}`)
  },

  async getCoupons ({ commit }, params) {
    try {
      return await this.$axios.$get('/coupons', { params })
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while getting coupons'
      })

      throw error
    }
  },

  createCoupon (_, data) {
    return this.$axios.$post('/coupons', data)
  },

  updateCoupon (_, { id, data }) {
    return this.$axios.$patch(`/coupons/${id}`, data)
  },

  deleteCoupon (_, id) {
    return this.$axios.$delete(`/coupons/${id}`)
  }

}
