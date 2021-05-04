export default {
  createOfflineWorksheetCategory (_, data) {
    return this.$axios.$post('/offline-worksheets-cats', data)
  },

  deleteOfflineWorksheetCategory (_, id) {
    return this.$axios.$delete(`/offline-worksheets-cats/${id}`)
  },

  getCategoriesWorksheetsOfflineByWorksheetId (_, id) {
    return this.$axios.$get(`/categories-worksheets-offline/worksheet/${id}`)
  },

  async getOfflineWorksheetCategories ({ commit }, params) {
    const data = await this.$axios.$get('/offline-worksheets-cats', { params })
    return data
  },

  updateOfflineWorksheetCategory (_, { id, data }) {
    return this.$axios.$patch(`/offline-worksheets-cats/${id}`, data)
  },

  getChildWorksheets (_, id) {
    return this.$axios.$get(`/worksheets/children/${id}`)
  }
}
