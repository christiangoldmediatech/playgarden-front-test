import { snotifyError } from '@/utils/vuex'

export default {
  store ({ commit }, data) {
    return new Promise((resolve, reject) =>
      this.$axios
        .post('/children', data)
        .then(({ data = [] } = {}) => resolve(data))
        .catch((error) => {
          snotifyError(commit, {
            body: 'Sorry! There was an error while storing.'
          })

          reject(error)
        })
    )
  }
}
