import { toastError } from '@/utils/vuex'

export default {
  async getChildrenProgress ({ commit }) {
    try {
      const data = await this.$axios.get('/children/progress/list')

      commit('SET_CHILDREN_PROGRESS', data)

      return data
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while getting the children\'s progress.'
      })
    }
  },

  getChildrenProgressExport () {
    return this.$axios.get('/children/progress/export')
  },

  async getUserChildrenProgress () {
    const response = await this.$axios.get('/children?progress=1')

    return response.data
  }
}
