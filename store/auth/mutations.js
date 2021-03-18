import { set } from '@/utils/vuex'

const resetState = (state) => {
  state.accessToken = null
  state.expiresAt = null
  state.issuedAt = null
  state.userInfo = {}
}

export default {
  LOGOUT (state) {
    resetState(state)
    this.$axios.setToken('', 'Bearer')
  },
  SET_ACCESS_TOKEN: set('accessToken'),
  SET_AXIOS_TOKEN (_, token) {
    this.$axios.setToken(token, 'Bearer')
  },
  SET_EXPIRES_AT: set('expiresAt'),
  SET_ISSUED_AT: set('issuedAt'),
  SET_PLAYDATE_INVITATION_TOKEN: set('playdateInvitationToken'),
  SET_USER_INFO: set('userInfo')
}
