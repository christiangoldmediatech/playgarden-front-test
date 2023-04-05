import { toastError } from '@/utils/vuex'

export default {

  getLearnPlay ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('/play-and-learn', { params })
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting Grades.'
          })
          // TO DO async away
          reject(error)
        })
    )
  }
}
