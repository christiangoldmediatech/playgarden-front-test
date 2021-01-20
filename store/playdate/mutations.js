import { set } from '~/utils/vuex'
import { getDefaultState } from './state'

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
