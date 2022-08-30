import { Flow } from '@/composables/users/enums/flow.enum'
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
  }
})
