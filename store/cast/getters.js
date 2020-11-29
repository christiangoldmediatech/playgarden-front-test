import { get } from '@/utils/vuex'

export default {
  getStatus: get('status'),
  getCurrentTime: get('currentTime'),
  getCasting: get('isCasting')
}
