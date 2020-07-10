import { snotifyError } from '@/utils/vuex'

export default {
  store ({ commit, dispatch, getters }, data) {
    return new Promise((resolve, reject) =>
      this.$axios
        .post('/auth/signup', data)
        .then(({ data = {} } = {}) => {
          dispatch('auth/setToken', data.accessToken, { root: true })

          resolve()
        })
        .catch((error) => {
          snotifyError(commit, {
            body: 'Sorry! There was an error while signing you up.'
          })

          reject(error)
        })
    )
  }
}
