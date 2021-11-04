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
  },
  SET_IS_TRIAL_ENDING_WEEK_THREE_MODAL_VISIBLE (state, bool) {
    state.isTrialEndingWeekThreeModalVisible = bool
  },
  SET_IS_TRIAL_ENDING_WEEK_FOUR_MODAL_VISIBLE (state, bool) {
    state.isTrialEndingWeekFourModalVisible = bool
  },
  SET_PLAN_UPGRADE_MODAL_VISIBILITY (state, bool) {
    state.isPlanUpgradeModalVisible = bool
  },
  SET_IS_TRIAL_ENDING_PLAN_SELECTED_MODAL_VISIBLE (state, bool) {
    state.isTrialEndingPlanSelectedModalVisible = bool
  }
}
