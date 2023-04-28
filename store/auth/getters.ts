import { getterTree } from 'typed-vuex'
import { PlanTier } from '@/models'
import { Flow } from '@/composables/users/enums'
import dayjs from 'dayjs'
import { state } from './'

export default getterTree(state, {
  getAccessToken: (state) => state.accessToken,
  getExpiresAt: (state) => state.expiresAt,
  getIssuedAt: (state) => state.issuedAt,
  getUserInfo: (state) => state.userInfo || {},

  isUserCaregiver: (state): boolean =>
    state.userInfo?.role?.name === 'CAREGIVERS',

  isUserEmailUnverified: (state): boolean =>
    (state.userInfo?.registerStep || 0) === 6 && !state.userInfo?.validatedDate,

  isUserInSignupProcess: (state): boolean =>
    (state.userInfo?.registerStep || 0) < 5,

  isUserLoggedIn: (state): boolean => Boolean(state.userInfo?.id),

  isRegistrationComplete: (state): boolean => Boolean(state.userInfo && state.userInfo.registerStep > 3),

  hasTrialOrPlatinumPlan: (state): boolean =>
    state.userInfo?.planSelected.id === PlanTier.ONLINE_PRESCHOOL ||
    state.userInfo?.trial ||
    true, // TODO: remove in February

  getPlaydateInvitationToken: (state) => state.playdateInvitationToken,
  isUserInTrial: (state): boolean => state.userInfo?.trial || false,

  hasPlayAndLearnPlan: (state): boolean =>
    (state.userInfo?.planSelected &&
      (state.userInfo.planSelected.id === PlanTier.PLAY_AND_LEARN ||
        state.userInfo.planSelected.id === PlanTier.PLAY_AND_LEARN_LIVE)) ||
    false,

  hasBasicPlayAndLearnPlan: (state): boolean =>
    (state.userInfo?.planSelected &&
      state.userInfo.planSelected.id === PlanTier.PLAY_AND_LEARN) ||
    false,

  hasPlayAndLearnLivePlan: (state): boolean =>
    state.userInfo?.planSelected?.id === PlanTier.PLAY_AND_LEARN_LIVE,

  getFinishNoCCFlow: (state) =>
    state.userInfo &&
    state.userInfo.flow === Flow.NOCREDITCARD &&
    !state.userInfo.hasCreditCards &&
    dayjs().diff(dayjs(state.userInfo.createdAt), 'days') >= 3 &&
    !state.disableCreditCardNeededAlert

})
