import { set } from '@/utils/vuex'
import { getDefaultState } from './state'

const RESET_STATE = (state) => {
  Object.assign(state, getDefaultState())
}

export default {
  SET_ROLES: set('rows'),
  RESET_STATE
}
