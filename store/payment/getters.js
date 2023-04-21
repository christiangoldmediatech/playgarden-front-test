import { get } from '@/utils/vuex'

export default {
  getBilling: get('billing'),
  getCards: get('cards'),
  getUserPlan: get('userPlan')
}
