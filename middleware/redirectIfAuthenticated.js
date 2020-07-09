import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'

export default function ({ redirect, route, store }) {
  if (
    process.client &&
    store.getters['auth/getAccessToken'] &&
    unauthenticatedRoutes[route.name] &&
    route.name !== 'jwt-recovery'
  ) {
    redirect({ name: 'app-dashboard' })
  }
}
