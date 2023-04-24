import { set } from '@/utils/vuex'

export default {
  SET_ROWS: set('rows'),
  RESET (state) {
    state.rows = []
  }
}
