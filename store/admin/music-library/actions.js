import { snotifyError } from '@/utils/vuex'

export default {
  createMuiscLibrary (_, data) {
    return this.$axios.$post('music-library', data)
  },

  deleteMuiscLibrary (_, id) {
    return this.$axios.$delete(`music-library/${id}`)
  },

  getMuiscLibrary ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('music-library', { params })
        .then(resolve)
        .catch((error) => {
          snotifyError(commit, {
            body: 'Sorry! There was an error while getting Live Sessions.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },

  updateMuiscLibrary (_, { id, data }) {
    return this.$axios.$patch(`music-library/${id}`, data)
  }
}
