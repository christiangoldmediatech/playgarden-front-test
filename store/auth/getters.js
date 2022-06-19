import { get } from '@/utils/vuex'
import { get as getLodash } from 'lodash'
import { PlanTier } from '@/models'

export default {
  getAccessToken: get('accessToken'),
  getExpiresAt: get('expiresAt'),
  getIssuedAt: get('issuedAt'),
  getUserInfo: state => state.userInfo || {},
  isUserCaregiver: (_, getters) =>
    getLodash(getters, 'getUserInfo.role.name') === 'CAREGIVERS',
  isUserEmailUnverified: (_, getters) =>
    (getters.getUserInfo.registerStep || 0) === 6 &&
    !getters.getUserInfo.validatedDate,
  isUserInSignupProcess: (_, getters) =>
    (getters.getUserInfo.registerStep || 0) < 5,
  isUserLoggedIn: (_, getters) => Boolean(getters.getUserInfo.id),
  hasTrialOrPlatinumPlan: (_, getters) =>
    getLodash(getters, 'getUserInfo.planSelected.id') === PlanTier.HOMESCHOOL ||
    getLodash(getters, 'getUserInfo.trial') ||
    true, // TODO: remove in February
  getPlaydateInvitationToken: get('playdateInvitationToken'),
  isUserInTrial: (_, getters) =>
    getLodash(getters, 'getUserInfo.trial') || false,
  hasUserLearnAndPlayPlan: (_, getters) =>
    // getters.getUserInfo.planSelected.id === PlanTier.LEARN_PLAY || false
    false
}
