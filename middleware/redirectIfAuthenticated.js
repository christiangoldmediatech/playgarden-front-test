import { get } from 'lodash'

import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'

export default function ({ redirect, route, store }) {
  const user = store.getters['auth/getUserInfo']

  const ignoreRoute = {
    'auth-verify-email': 1,
    help: 1,
    'jwt-recovery': 1,
    'privacy-policy': 1,
    'terms-conditions': 1,
    'shared-slug': 1
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
      return (get(user, 'role.name') === 'SPECIALISTS') ? redirect({ name: 'admin-agenda' }) : redirect({ name: 'admin-curriculum-management' })
    } else {
      return redirect({ name: 'app-dashboard' })
    }
  }
}
