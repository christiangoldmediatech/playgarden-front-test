import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'

export default async function ({ store, redirect, route }) {
  const isUserInStore = store.getters['auth/isUserLoggedIn']
  const token = store.getters['auth/getAccessToken']

  if (token && !isUserInStore) {
    await store.dispatch('auth/fetchUserInfo')
  }

  const isLoggedIn = await store.dispatch('auth/checkAuth')
  const isUnauthenticatedRoute = !!unauthenticatedRoutes[route.name]

  if (!isLoggedIn) {
    isUnauthenticatedRoute
      ? store.dispatch('auth/logout')
      : store.dispatch('auth/logout', redirect)
  }
}
