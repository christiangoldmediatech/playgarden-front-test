import { set } from '@/utils/vuex'
import { getDefaultState } from './state'

const RESET_STATE = (state) => {
  Object.assign(state, getDefaultState())
}

export default {
  SET_TYPES: set('types'),
  RESET_STATE
}
