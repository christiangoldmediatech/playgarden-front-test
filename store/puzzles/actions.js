import { toastError } from '@/utils/vuex'

export default {
  createPuzzle (_, data) {
    return this.$axios.$post('/puzzle', data)
  },

  deletePuzzle (_, id) {
    return this.$axios.$delete(`/puzzle/${id}`)
  },

  getPuzzles ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('/puzzle', { params })
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting puzzles.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },

  updatePuzzle (_, { id, data }) {
    return this.$axios.$patch(`/puzzle/${id}`, data)
  }
}
