export default {
  SET_IS_SHIPPING_MODAL_VISIBLE (state, bool) {
    state.isShippingModalVisible = bool
  },
  SET_NOTIFICATION_CARD (state, payload) {
    const defaultPayload = {
      isVisible: true,
      title: '',
      description: '',
      image: '',
      action: null
    }
    payload = { ...defaultPayload, ...payload }

    state.notificationCard = { ...payload }
  }
}
