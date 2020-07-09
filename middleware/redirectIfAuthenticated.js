import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'

export default function ({ app, redirect, route, store }) {
  const token = store.getters['auth/getAccessToken']
  app.$axios.setToken(token, 'Bearer')

  if (
    process.client &&
    token &&
    unauthenticatedRoutes[route.name] &&
    route.name !== 'jwt-recovery'
  ) {
    redirect({ name: 'app-dashboard' })
  }
}
