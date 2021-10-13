export default {
  SET_TRIAL_EXPIRING_RIBBON_VISIBLE (state, bool) {
    state.isTrialExpiringRibbonVisible = bool
  },
  SET_TRIAL_EXPIRED_MODAL_VISIBLE (state, bool) {
    state.isTrialExpiredModalVisible = bool
  },
  SET_IS_SHIPPING_MODAL_VISIBLE (state, bool) {
    state.isShippingModalVisible = bool
  },
  SET_NOTIFICATION_CARD (state, payload) {
    const defaultPayload = {
      isVisible: true,
      title: '',
      description: '',
      image: '',
      action: null,
      actionText: 'To learn more' // ...click here
    }
    payload = { ...defaultPayload, ...payload }

    state.notificationCard = { ...payload }
  },
  SET_IS_TRIAL_ENDING_WEEK_TWO_MODAL_VISIBLE (state, bool) {
    state.isTrialEndingWeekTwoModalVisible = bool
  }
}
