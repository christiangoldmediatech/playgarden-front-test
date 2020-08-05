import { set } from '@/utils/vuex'

export default {
  SET_NOTIFICATION_MESSAGE: set('globalNotificationMessage'),
  SET_CURRENT_CHILD: set('currentChild'),
  SET_CURRENT_CHILD_EXPIRES: set('currentChildExpires')
}
