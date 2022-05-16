import { snotifyError } from '@/utils/vuex'

export default {
  getFirstLearnPlay({ commit }, childId) {
    if (!childId) {
      return
    }

    return this.$axios.$get(`/play-and-learn/by-child/${childId}`).catch((error) => {
      snotifyError(commit, {
        body: 'Sorry! There was an error while getting learn-play.'
      })

      throw error
    })
  }
}
