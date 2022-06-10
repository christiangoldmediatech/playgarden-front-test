import { snotifyError } from '@/utils/vuex'

export default {
  getFirstLearnPlay ({ commit, rootGetters }, params) {
    const childId = rootGetters.getCurrentChild[0].id
    return new Promise((resolve, reject) =>
      this.$axios
        .$get(`/play-and-learn/by-child/${childId}`, { params })
        .then(resolve)
        .catch((error) => {
          snotifyError(commit, {
            body: 'Sorry! There was an error while getting learn-play.'
          })
          // TO DO async away
          reject(error)
        })
    )
  }
}
