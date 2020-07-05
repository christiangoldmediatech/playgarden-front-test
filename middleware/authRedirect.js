// import unauthenticatedRoutes from '@/utils/consts/unauthenticatedRoutes.js'

export default async function ({ app, store, redirect, route }) {
  const token = store.getters['auth/getAccessToken']
  app.$axios.setToken(token, 'Bearer')
  const isLoggedIn = await store.dispatch('auth/checkAuth')
  // If the user is not authenticated redirect to /
  if (!isLoggedIn) {
    store.commit('auth/logout', redirect)
  }
}
