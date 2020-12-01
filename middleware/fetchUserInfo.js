export default function ({ app, store }) {
  if (process.client) {
    console.log('on fetchUserInfo')
    const token = store.getters['auth/getAccessToken']
    const logged = store.getters['auth/isUserLoggedIn']

    store.commit('auth/SET_AXIOS_TOKEN', token)

    if (token && !logged) {
      console.log('fetching info')
      return store.dispatch('auth/fetchUserInfo')
    }
  }
}
