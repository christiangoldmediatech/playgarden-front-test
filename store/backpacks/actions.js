import { snotifyError } from '@/utils/vuex'

export default {
  index ({ commit, dispatch, getters }, data) {
    return new Promise((resolve, reject) =>
      this.$axios
        .get('/backpacks', data)
        .then(({ data = [] } = {}) => resolve(data))
        .catch((error) => {
          snotifyError(commit, {
            body: 'Sorry! There was an error while getting backpacks.'
          })

          reject(error)
        })
    )
  }
}
