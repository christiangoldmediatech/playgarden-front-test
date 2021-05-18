export default {
  SET_UTM (state, source = {}) {
    state.utmSource = source.utm_source || ''
    state.utmMedium = source.utm_medium || ''
    state.utmCampaign = source.utm_campaign || ''
    state.utmTerm = source.utm_term || ''
    state.utmName = source.utm_name || ''
    state.gc1Id = source.gc1Id || ''
  }
}
