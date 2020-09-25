import { get } from '@/utils/vuex'

export default {
  getAccessToken: get('accessToken'),
  getExpiresAt: get('expiresAt'),
  getIssuedAt: get('issuedAt'),
  getUserInfo: state => state.userInfo || {},
  isUserInSignupProcess: (_, getters) =>
    (getters.getUserInfo.registerStep || 0) < 5,
  isUserEmailUnverified: (_, getters) =>
    (getters.getUserInfo.registerStep || 0) === 6 &&
    !getters.getUserInfo.validatedDate,
  isUserLoggedIn: (_, getters) => Boolean(getters.getUserInfo.id)
}
