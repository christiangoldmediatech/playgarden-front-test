import { set } from '@/utils/vuex'

export default {
  SET_LOADING: set('castFrameworkLoading'),
  SET_AVAILABLE: set('castAvailable'),
  SET_CASTING: set('isCasting'),
  SET_CURRENT_TIME: set('currentTime'),
  SET_STATUS: set('status')
}
