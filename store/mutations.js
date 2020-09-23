import { set } from '@/utils/vuex'

export default {
  DISABLE_AXIOS_GLOBAL_ERROR_HANDLER: (state) => {
    state.axiosGlobalErrorHandler = true
  },
  ENABLE_AXIOS_GLOBAL_ERROR_HANDLER: (state) => {
    state.axiosGlobalErrorHandler = false
  },
  SET_CURRENT_CHILD: set('currentChild'),
  SET_CURRENT_CHILD_EXPIRES: set('currentChildExpires'),
  SET_NOTIFICATION_MESSAGE: set('globalNotificationMessage')
}
