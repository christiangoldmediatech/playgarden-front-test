import { toastError } from '@/utils/vuex'

export default {
  createShippingAddress (_, data) {
    const address = { ...data }

    if (!address.address2) {
      delete address.address2
    }

    return this.$axios.$post('/shipping-address', address)
  },

  async createShippingAddressByAdministrator ({ commit }, data) {
    const address = { ...data }

    if (!address.address2) {
      delete address.address2
    }

    const postData = await this.$axios.$post(`/shipping-address/user/${data.userId}`, address)

    commit('SET_SHIPPING_ADDRESS', postData)

    return postData
  },

  async getShippingAddress ({ commit }) {
    try {
      const data = await this.$axios.$get('/shipping-address')

      commit('SET_SHIPPING_ADDRESS', data)

      return data
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while getting the shipping address.'
      })
    }
  },

  getShippingAddressByUserId (_, { id }) {
    return this.$axios.$get(`/shipping-address/${id}`)
  },

  async updateShippingAddress ({ commit }, { id, data }) {
    const address = { ...data }

    if (!address.address2) {
      delete address.address2
    }

    const patchData = await this.$axios.$patch(`/shipping-address/${id}`, address)

    commit('SET_SHIPPING_ADDRESS', patchData)

    return patchData
  },

  updateShippingAddressByAdministrator (_, { id, data }) {
    const address = { ...data }

    return this.$axios.$patch(`/shipping-address/${id}/user/${data.userId}`, address)
  },

  deleteShippingAddress (_, id) {
    return this.$axios.$delete(`/shipping-address/${id}`)
  }
}
