export default {
  createShippingAddress (_, data) {
    const address = { ...data }

    if (!address.address2) {
      delete address.address2
    }

    return this.$axios.$post('/shipping-address', address)
  },

  getShippingAddresses () {
    return this.$axios.$get('/shipping-address')
  },

  updatePrivacyPolicy (_, data) {
    return this.$axios.$patch('/configurations/privacy', data)
  }
}
