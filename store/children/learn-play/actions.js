import { snotifyError } from '@/utils/vuex'

export default {
  async getFirstLearnPlay({ commit }, childId) {
    if (!childId) {
      return
    }

    try {
      return await this.$axios.$get(`/play-and-learn/by-child/${childId}`)
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while getting learn-play.'
      })

      throw error
    }
  }
}
