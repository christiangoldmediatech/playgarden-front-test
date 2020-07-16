import { get } from '@/utils/vuex'

export default {
  getAccessToken: get('accessToken'),
  getExpiresAt: get('expiresAt'),
  getIssuedAt: get('issuedAt'),
  getUserInfo: state => state.userInfo || {},
  isUserLoggedIn: (_, getters) => Boolean(getters.getUserInfo.id)
}
