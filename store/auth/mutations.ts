import { mutationTree } from 'typed-vuex'
import { User } from '@/composables/users/types/user.type'
import { state } from './'

export default mutationTree(state, {
  LOGOUT(state) {
    state.accessToken = null
    state.expiresAt = null
    state.issuedAt = null
    state.userInfo = {} as User
  },

  SET_ACCESS_TOKEN(state, accessToken: string) {
    state.accessToken = accessToken
  },

  SET_EXPIRES_AT(state, expiresAt: number) {
    state.expiresAt = expiresAt
  },

  SET_ISSUED_AT(state, issuedAt: number) {
    state.issuedAt = issuedAt
  },

  SET_PLAYDATE_INVITATION_TOKEN(state, playdateInvitationToken: string) {
    state.playdateInvitationToken = playdateInvitationToken
  },

  SET_USER_INFO(state, userInfo: User | null) {
    state.userInfo = userInfo
  }
})
