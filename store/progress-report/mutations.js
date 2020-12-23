import { set } from '@/utils/vuex'
import { getDefaultState } from './state'

const RESET_STATE = (state) => {
  Object.assign(state, getDefaultState())
}

export default {
  SET_REPORT: set('report'),
  RESET_STATE
}
