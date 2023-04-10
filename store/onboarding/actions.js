import { toastError } from '@/utils/vuex'

export default {
  createOnboarding (_, data) {
    return this.$axios.$post('/onboarding', data)
  },

  deleteOnboarding (_, id) {
    return this.$axios.$delete(`/onboarding/${id}`)
  },

  getOnboardings ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('/onboarding', { params })
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting onboarding.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },

  updateOnboarding (_, { id, data }) {
    return this.$axios.$patch(`/onboarding/${id}`, data)
  }
}
