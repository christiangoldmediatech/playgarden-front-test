import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'

export default function ({ app, redirect, route, store }) {
  if (process.client) {
    const token = store.getters['auth/getAccessToken']
    app.$axios.setToken(token, 'Bearer')

    if (
      token &&
      unauthenticatedRoutes[route.name] &&
      route.name !== 'jwt-recovery'
    ) {
      redirect({ name: 'app-dashboard' })
    }
  }
}
