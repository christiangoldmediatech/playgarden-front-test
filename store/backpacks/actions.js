import { toastError } from '@/utils/vuex'

export default {
  createBackpack (_, data) {
    return this.$axios.$post('/backpacks', data)
  },

  deleteBackpack (_, id) {
    return this.$axios.$delete(`/backpacks/${id}`)
  },

  async fetchBackpacks ({ commit }, params) {
    try {
      const data = await this.$axios.$get('/backpacks', { params })

      commit('SET_BACKPACKS', data)

      return data
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while getting backpacks.'
      })
    }
  },

  updateBackpack (_, { id, data }) {
    return this.$axios.$patch(`/backpacks/${id}`, data)
  }
}
