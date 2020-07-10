export default function ({ store, redirect, route }) {
  if (process.client) {
    const token = store.getters['auth/getAccessToken']
    const user = store.getters['auth/getUserInfo'] || {}

    if (token && !user.id) {
      return store.dispatch('auth/fetchUserInfo')
    }
  }
}
