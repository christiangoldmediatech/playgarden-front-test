import { snotifyError } from '@/utils/vuex'

export default {

  getFirstLearnPlay ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('/play-and-learn/get/current', { params })
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
