export default {
  getUtm: state => ({
    utmSource: state.utmSource,
    utmMedium: state.utmMedium,
    utmCampaign: state.utmCampaign,
    utmTerm: state.utmTerm,
    utmName: state.utmName,
    gc1Id: state.gc1Id
  })
}
