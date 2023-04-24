import { set } from '@/utils/vuex'

export default {
  SET_CAREGIVERS: set('caregivers'),
  RESET (state) {
    state.caregivers = []
  }
}
