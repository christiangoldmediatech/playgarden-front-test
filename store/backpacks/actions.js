import { toastError } from '@/utils/vuex'

export default {
  createBackpack (_, data) {
    return this.$axios.$post('/backpacks', data)
  },

  deleteBackpack (_, id) {
    return this.$axios.$delete(`/backpacks/${id}`)
  },

  getBackpacks ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('/backpacks', { params })
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting backpacks.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },

  updateBackpack (_, { id, data }) {
    return this.$axios.$patch(`/backpacks/${id}`, data)
  }
}
