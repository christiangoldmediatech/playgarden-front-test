import { getDefaultState } from './state'
import { set } from '@/utils/vuex'

const RESET_STATE = (state) => {
  Object.assign(state, getDefaultState())
}

export default {
  SET_TYPES: set('types'),
  SET_ROWS: set('rows'),
  SET_FILTERED: set('filtered'),
  SET_LIMIT: set('limit'),
  SET_TOTAL: set('total'),
  SET_PAGE: set('page'),
  RESET_STATE
}
