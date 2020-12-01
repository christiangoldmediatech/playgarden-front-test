import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'

export default async function ({ store, redirect, route }) {
  if (process.client) {
    const isLoggedIn = await store.dispatch('auth/checkAuth')
    console.log('on auth')
    if (!isLoggedIn) {
      console.log('not logged')
      if (unauthenticatedRoutes[route.name]) {
      // route is an expected unauthorized path don't redirect
        return store.dispatch('auth/logout')
      }
      console.log('redirecting to loggin')
      return store.dispatch('auth/logout', redirect)
    }
  }
}
