export default {
  createShippingAddress (_, data) {
    const address = { ...data }

    if (!address.address2) {
      delete address.address2
    }

    return this.$axios.$post('/shipping-address', address)
  },

  getShippingAddress () {
    return this.$axios.$get('/shipping-address')
  },

  updateShippingAddress (_, { id, data }) {
    const address = { ...data }

    if (!address.address2) {
      delete address.address2
    }

    return this.$axios.$patch(`/shipping-address/${id}`, address)
  }
}
