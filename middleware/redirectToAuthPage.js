import unauthenticatedRoutes from '@/utils/consts/unauthenticatedRoutes.js'

export default async function ({ app, store, redirect, route }) {
  const isLoggedIn = await store.dispatch('auth/checkAuth')
  if (!isLoggedIn) {
    if (unauthenticatedRoutes.includes(route.fullPath)) {
      // route is an expected unauthorized path don't redirect
      return store.dispatch('auth/logout')
    } else {
      return store.dispatch('auth/logout', redirect)
    }
  } else {
    return redirect('/auth')
  }
}
