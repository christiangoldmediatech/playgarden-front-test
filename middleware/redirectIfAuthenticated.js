import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'

export default function ({ redirect, route, store }) {
  const ignoreRoute = {
    'auth-verify-email': 1,
    'jwt-recovery': 1,
    'privacy-policy': 1,
    'terms-conditions': 1
  }

  if (
    process.client &&
    store.getters['auth/getAccessToken'] &&
    unauthenticatedRoutes[route.name] &&
    !ignoreRoute[route.name]
  ) {
    redirect({ name: 'app-dashboard' })
  }
}
