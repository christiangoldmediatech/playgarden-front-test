import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'

export default async function ({ store, redirect, route }) {
  if (process.client) {
    const isLoggedIn = await store.dispatch('auth/checkAuth')
    if (!isLoggedIn) {
      if (unauthenticatedRoutes[route.name]) {
        // route is an expected unauthorized path don't redirect
        return store.dispatch('auth/logout')
      }
      return store.dispatch('auth/logout', redirect)
    }
  }
}
