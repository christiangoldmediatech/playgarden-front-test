import { snotifyError } from '@/utils/vuex'

export default {
  async store ({ commit }, data) {
    try {
      const response = await this.$axios.post('/children', data)

      return response.data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while storing.'
      })
    }
  }
}
