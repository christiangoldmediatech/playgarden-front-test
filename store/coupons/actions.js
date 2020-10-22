import { snotifyError } from '@/utils/vuex'

export default {
  async getCoupons ({ commit }) {
    try {
      return await this.$axios.$get('/coupons').then(response => response.data)
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while getting coupons'
      })

      throw error
    }
  },

  /* getCoupons ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('/coupons', { params })
        .then(resolve) => {
          console.log('resolve--', resolve);
        }
        .catch((error) => {
          snotifyError(commit, {
            body: 'Sorry! There was an error while getting coupons.'
          })
          // TO DO async away
          reject(error)
        })
    )
  }, */

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
