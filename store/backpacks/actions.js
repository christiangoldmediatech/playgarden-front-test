import { snotifyError } from '@/utils/vuex'

export default {
  index ({ commit }, data) {
    return new Promise((resolve, reject) =>
      this.$axios
        .get('/backpacks', data)
        .then(({ data = [] } = {}) => resolve(data))
        .catch((error) => {
          snotifyError(commit, {
            body: 'Sorry! There was an error while getting backpacks.'
          })
          // TO DO async away
          reject(error)
        })
    )
  }
}
