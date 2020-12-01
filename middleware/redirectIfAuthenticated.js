import { get } from 'lodash'

import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'

export default function ({ redirect, route, store }) {
  console.log('on redirectIfAuthenticated')
  const user = store.getters['auth/getUserInfo']

  const ignoreRoute = {
    'auth-verify-email': 1,
    'jwt-recovery': 1,
    'privacy-policy': 1,
    'terms-conditions': 1,
    help: 1
  }

  if (
    process.client &&
    store.getters['auth/getAccessToken'] &&
    unauthenticatedRoutes[route.name] &&
    !ignoreRoute[route.name] &&
    user.role &&
    route.query.process !== 'signup'
  ) {
    if (get(user, 'role.section') === 'ADMIN') {
      console.log('redirecting admin curriculum management')
      return redirect({ name: 'admin-curriculum-management' })
    } else {
      console.log('redirecting to dashboard')
      return redirect({ name: 'app-dashboard' })
    }
  }
}
