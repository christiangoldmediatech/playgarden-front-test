import { set } from '@/utils/vuex'
import { getDefaultState } from './state'

const RESET_STATE = (state) => {
  Object.assign(state, getDefaultState())
}

export default {
  SET_MUSIC_LIBRARIES: set('rows'),
  SET_FILTERED: set('filtered'),
  SET_LIMIT: set('limit'),
  SET_TOTAL: set('total'),
  SET_PAGE: set('page'),
  RESET_STATE
}
