import { set } from '@/utils/vuex'

export default {
  SET_NOTIFICATIONS: set('notifications'),
  TOGGLE_EMAIL_NOTIFICATION (state, id) {
    const index = state.notifications.findIndex(item => item.id === id)

    const notificationsCopy = { ...state.notifications[index] }

    notificationsCopy.enabled = notificationsCopy.enabled
      ? { ...notificationsCopy.enabled, email: !notificationsCopy.enabled.email }
      : {
          sms: false,
          email: true
        }

    state.notifications[index] = notificationsCopy
  }
}
