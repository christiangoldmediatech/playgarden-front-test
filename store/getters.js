import { get } from '@/utils/vuex'

export default {
  getGlobalNotificationMessage: get('globalNotificationMessage'),
  getCurrentChild: get('currentChild')
}
