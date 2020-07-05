import { set } from '@/utils/vuex'

const resetState = (state) => {
  state.accessToken = null
  state.issuedAt = null
  state.expiresAt = null
}

export default {
  SET_ACCESS_TOKEN: set('accessToken'),
  SET_ISSUED_AT: set('issuedAt'),
  SET_EXPIRES_AT: set('expiresAt'),
  LOGOUT (state) {
    resetState(state)
  }
}
