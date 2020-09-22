import { get } from '@/utils/vuex'

export default {
  getUserInfo: get('userInfo'),
  isUserLoggedIn: (_, getters) => Boolean(getters.getUserInfo.email)
}
