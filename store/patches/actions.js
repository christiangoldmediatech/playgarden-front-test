import { toastError } from '@/utils/vuex'

export default {
  createPatch (_, data) {
    return this.$axios.$post('/patches', data)
  },

  deletePatch (_, id) {
    return this.$axios.$delete(`/patches/${id}`)
  },

  getPatches ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('/patches', { params })
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting patches.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },

  updatePatch (_, { id, data }) {
    return this.$axios.$patch(`/patches/${id}`, data)
  }
}
