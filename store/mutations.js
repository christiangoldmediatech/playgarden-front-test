import { set } from '@/utils/vuex'

export default {
  DISABLE_AXIOS_GLOBAL_ERROR_HANDLER: (state, { autoEnableIn = 30 } = {}) => {
    state.axiosGlobalErrorHandler = true

    if (autoEnableIn) {
      setTimeout(
        () => (state.axiosGlobalErrorHandler = false),
        autoEnableIn * 1000
      )
    }
  },
  ENABLE_AXIOS_GLOBAL_ERROR_HANDLER: (state) => {
    state.axiosGlobalErrorHandler = false
  },
  SET_CURRENT_CHILD: set('currentChild'),
  SET_CURRENT_CHILD_EXPIRES: set('currentChildExpires'),
  SET_NOTIFICATION_MESSAGE: set('globalNotificationMessage')
}
