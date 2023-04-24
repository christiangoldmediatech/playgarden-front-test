import { set } from '@/utils/vuex'

export default {
  SET_BACKPACKS: set('backpacks'),
  RESET (state) {
    state.backpacks = []
  }
}
