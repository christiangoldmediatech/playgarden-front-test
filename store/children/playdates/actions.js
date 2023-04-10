import { toastError } from '@/utils/vuex'

export default {
  getChildrenInfo ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('/playdates/children/', { params })
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting info.'
          })
          reject(error)
        })
    )
  },

  getPlaydateInvite (_, { id }) {
    return this.$axios.$get(`/playdates/invite/${id}`)
  },

  removeChildrenPlaydates (_, id) {
    return this.$axios.$delete(`/playdates/${id}/invite/children/${id}`)
  },

  deletePlaydatesInvitation (_, id) {
    return this.$axios.$delete(`/playdates/invite/${id}`)
  }
}
