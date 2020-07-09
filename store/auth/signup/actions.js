export default {
  store ({ commit, dispatch, getters }, data) {
    return new Promise((resolve, reject) => this.$axios
      .post('/auth/signup', data)
      .then(({ data = {} } = {}) => {
        dispatch('auth/setToken', data.accessToken, { root: true })

        resolve()
      })
      .catch((error) => {
        commit(
          'SET_NOTIFICATION_MESSAGE',
          {
            body: 'Sorry! There was an error while signing you up.',
            type: 'error'
          },
          { root: true }
        )

        reject(error)
      }))
  }
}
