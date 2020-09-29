import { get } from '@/utils/vuex'
import { get as getL } from 'lodash'

export default {
  getAccessToken: get('accessToken'),
  getExpiresAt: get('expiresAt'),
  getIssuedAt: get('issuedAt'),
  getUserInfo: state => state.userInfo || {},
  isUserCaregiver: (_, getters) =>
    getL(getters, 'getUserInfo.role.name') === 'CAREGIVERS',
  isUserEmailUnverified: (_, getters) =>
    (getters.getUserInfo.registerStep || 0) === 6 &&
    !getters.getUserInfo.validatedDate,
  isUserInSignupProcess: (_, getters) =>
    (getters.getUserInfo.registerStep || 0) < 5,
  isUserLoggedIn: (_, getters) => Boolean(getters.getUserInfo.id)
}
