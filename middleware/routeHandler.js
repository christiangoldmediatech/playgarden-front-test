import { get } from 'lodash'
import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'
import parentSubscriptionWhitelistedRoutes from '~/utils/consts/parentSubscriptionWhitelistedRoutes.json'
import routeHandlerIgnoredRoutes from '~/utils/consts/routeHandlerIgnoredRoutes.json'

export default async function ({ redirect, route, store }) {
  const isIgnoredRoute = !!routeHandlerIgnoredRoutes[route.name]

  if (isIgnoredRoute) {
    return
  }

  const token = store.getters['auth/getAccessToken']
  const isLoggedIn = await store.dispatch('auth/checkAuth', undefined, { root: true })
  const isUnauthenticatedRoute = !!unauthenticatedRoutes[route.name]
  const user = store.getters['auth/getUserInfo']

  /**
   * PICK CHILD
   */
  if (process.client && isLoggedIn) {
    await store.dispatch('auth/fetchUserInfo', undefined, { root: true })
    const shouldPickChild = await store.dispatch('pickChild', { $router: { push: redirect }, $route: route }, { root: true })

    if (shouldPickChild) {
      return
    }
  }

  /**
   * ROLE
   */

  const shouldRedirectUser =
    token &&
    isLoggedIn &&
    !!user.id &&
    !!user.role &&
    route.query.process !== 'signup'

  if (!shouldRedirectUser) {
    return
  }

  const isAppRoute = /^app-.*$/.test(route.name)
  const isAdminRoute = /^admin.*$/.test(route.name)
  const isAdminRole = get(user, 'role.section') === 'ADMIN'
  const isUserRole = get(user, 'role.section') === 'USERS'

  if ((isUnauthenticatedRoute || isAppRoute) && isAdminRole) {
    return get(user, 'role.name') === 'SPECIALISTS'
      ? redirect({ name: 'admin-agenda' })
      : redirect({ name: 'admin-curriculum-management' })
  } else if ((isUnauthenticatedRoute || isAdminRoute) && isUserRole) {
    return redirect({ name: 'app-dashboard' })
  }

  /**
   * CANCELED SUBSCRIPTION
   */

  const shouldRedirectToAccount =
    !parentSubscriptionWhitelistedRoutes[route.name] &&
    get(user, 'role.id') === 3 /* PARENT */ &&
    (!user.subscription || user.subscription.status === 'canceled')

  if (shouldRedirectToAccount) {
    return redirect({ name: 'app-account-index' })
  }

  /**
   * EMAIL VERIFIED
   */

  const shouldRedirectToDashboard =
    user.id &&
    user.validatedDate &&
    route.name === 'auth-verify-email' &&
    !['auth-logout', 'jwt-recovery'].includes(route.name)

  if (shouldRedirectToDashboard) {
    return redirect({ name: 'app-dashboard' })
  }
}
