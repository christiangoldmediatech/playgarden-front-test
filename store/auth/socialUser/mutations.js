import { set } from '@/utils/vuex'

const resetState = (state) => {
  state.userInfo = {}
}

export default {
  LOGOUT (state) {
    resetState(state)
  },
  SET_USER_INFO: set('userInfo')
}
