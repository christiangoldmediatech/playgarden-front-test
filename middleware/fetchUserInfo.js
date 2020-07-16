export default function ({ app, store }) {
  if (process.client) {
    const token = store.getters['auth/getAccessToken']
    const logged = store.getters['auth/isUserLogged']

    app.$axios.setToken(token, 'Bearer')

    if (token && !logged) {
      return store.dispatch('auth/fetchUserInfo')
    }
  }
}
