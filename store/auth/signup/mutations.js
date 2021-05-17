export default {
  SET_UTM (state, query) {
    state.utmSource = query.utmSource || ''
    state.utmMedium = query.utmMedium || ''
    state.utmCampaign = query.utmCampaign || ''
    state.utmTerm = query.utmTerm || ''
    state.utmName = query.utmName || ''
    state.gc1Id = query.gc1Id || ''
  }
}
