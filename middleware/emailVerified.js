import { get } from 'lodash'

export default function ({ redirect, route, store }) {
  if (process.client) {
    const user = store.getters['auth/getUserInfo']

    const ignoreRoute = {
      'auth-logout': 1,
      'jwt-recovery': 1
    }

    if (
      user.id &&
      !user.validatedDate &&
      !ignoreRoute[route.name] &&
      route.name !== 'auth-verify-email' &&
      route.query.process !== 'signup' &&
      (get(user, 'role.section') === 'PARENTS' ||
        get(user, 'role.section') === 'CAREGIVERS')
    ) {
      redirect({ name: 'auth-verify-email' })
    } else if (
      user.id &&
      user.validatedDate &&
      route.name === 'auth-verify-email' &&
      !ignoreRoute[route.name]
    ) {
      redirect({ name: 'app-dashboard' })
    }
  }
}
