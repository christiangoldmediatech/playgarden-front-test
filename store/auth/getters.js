import { get } from '@/utils/vuex'

export default {
  getAccessToken: get('accessToken'),
  getExpiresAt: get('expiresAt'),
  getIssuedAt: get('issuedAt'),
  getUserInfo: state => state.userInfo || {},
  isUserInSingupProcess: (_, getters) => (getters.getUserInfo.registerStep || 0) < 6,
  isUserLoggedIn: (_, getters) => Boolean(getters.getUserInfo.id)
}
