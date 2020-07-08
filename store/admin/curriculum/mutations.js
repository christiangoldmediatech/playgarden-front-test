import { getDefaultState } from './state'
import { set } from '@/utils/vuex'

const resetState = (state) => {
  Object.assign(state, getDefaultState())
}

export default {
  setRows: set('rows'),
  resetState
}
