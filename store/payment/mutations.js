import { set } from '@/utils/vuex'

export default {
  SET_BILLING: set('billing'),
  SET_CARDS: set('cards'),
  SET_USER_PLAN: set('userPlan'),
  RESET (state) {
    state.billing = null
    state.cards = []
    state.userPlan = null
  }
}
