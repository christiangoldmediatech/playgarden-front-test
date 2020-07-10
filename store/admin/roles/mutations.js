import { getDefaultState } from './state'
import { set } from '@/utils/vuex'

const RESET_STATE = (state) => {
  Object.assign(state, getDefaultState())
}

export default {
  SET_ROLES: set('rows'),
  RESET_STATE
}
