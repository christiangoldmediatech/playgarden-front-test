import { AuthFlow, Flow } from '@/composables/users/enums/flow.enum'
import { mutationTree } from 'typed-vuex'
import { state } from './'

export default mutationTree(state, {
  SET_UTM(state, source = {}) {
    state.utmSource = source.utm_source || ''
    state.utmMedium = source.utm_medium || ''
    state.utmCampaign = source.utm_campaign || ''
    state.utmTerm = source.utm_term || ''
    state.utmName = source.utm_name || ''
    state.gc1Id = source.gc1Id || ''
  },

  SET_AB_FLOW(state, abFlow: Flow) {
    state.abFlow = abFlow
  },

  SET_AUTH_FLOW(state, authFlow: AuthFlow) {
    state.authFlow = authFlow
  },

  SET_LIBRARY_ID(state, libraryId: number) {
    state.libraryId = libraryId
  },

  SET_LIBRARY_CARD_NUMBER(state, libraryCardNumber: string) {
    state.libraryCardNumber = libraryCardNumber
  },

  RESET_LIBRARY_CARD_PARAMS(state) {
    state.libraryId = null
    state.libraryCardNumber = ''
  }
})
