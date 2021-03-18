export default function ({ app, store }) {
  const token = store.getters['auth/getAccessToken']
  const logged = store.getters['auth/isUserLoggedIn']

  store.commit('auth/SET_AXIOS_TOKEN', token)

  if (token && !logged) {
    return store.dispatch('auth/fetchUserInfo')
  }
}
