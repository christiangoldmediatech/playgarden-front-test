import { get } from '@/utils/vuex'

export default {
  getGlobalNotificationMessage: get('globalNotificationMessage'),
  getCurrentChild: get('currentChild'),
  getCurrentChildExpires: get('currentChildExpires'),
  isDisabledAxiosGlobalErrorHandler: get('axiosGlobalErrorHandler'),
  getLanguages: get('languages')
}
