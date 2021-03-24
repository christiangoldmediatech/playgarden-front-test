export default async function ({ app, store }) {
  const token = store.getters['auth/getAccessToken']
  const logged = store.getters['auth/isUserLoggedIn']

  if (token && !logged) {
    return await store.dispatch('auth/fetchUserInfo')
  }
}
