import { getterTree } from 'typed-vuex'
import { state } from './'

export default getterTree(state, {
  getUtm: state => ({
    utmSource: state.utmSource,
    utmMedium: state.utmMedium,
    utmCampaign: state.utmCampaign,
    utmTerm: state.utmTerm,
    utmName: state.utmName,
    gc1Id: state.gc1Id
  }),
  hasValidLibraryCard(state) {
    return Boolean(state.libraryId && state.libraryCardNumber)
  }
})
