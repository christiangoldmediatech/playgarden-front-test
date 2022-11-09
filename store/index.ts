import { getAccessorType } from 'typed-vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import * as notifications from './notifications'
import * as auth from './auth'
import * as authSignup from './auth/signup'

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    notifications,
    auth: {
      ...auth,

      modules: {
        signup: authSignup
      }
    }
  }
})
