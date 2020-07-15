export default function ({ app, store }) {
  if (process.client) {
    const token = store.getters['auth/getAccessToken']
    const user = store.getters['auth/getUserInfo']

    app.$axios.setToken(token, 'Bearer')

    if (token && !user.id) {
      return store.dispatch('auth/fetchUserInfo')
    }
  }
}
