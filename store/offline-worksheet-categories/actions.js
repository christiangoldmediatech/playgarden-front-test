import { snotifyError } from '@/utils/vuex'

export default {
  createOfflineWorksheetCategory (_, data) {
    return this.$axios.$post('/offline-worksheets-cats', data)
  },

  deleteOfflineWorksheetCategory (_, id) {
    return this.$axios.$delete(`/offline-worksheets-cats/${id}`)
  },

  getCategoriesWorksheetsOfflineByWorksheet (_, id) {
    return this.$axios.$get(`/categories-worksheets-offline/worksheet/${id}`)
  },

  getOfflineWorksheetCategories ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('/offline-worksheets-cats', { params })
        .then(resolve)
        .catch((error) => {
          snotifyError(commit, {
            body: 'Sorry! There was an error while getting offline worksheets categories.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },

  updateOfflineWorksheetCategory (_, { id, data }) {
    return this.$axios.$patch(`/offline-worksheets-cats/${id}`, data)
  },

  getChildWorksheets (_, id) {
    return this.$axios.$get(`/worksheets/children/${id}`)
  }
}
