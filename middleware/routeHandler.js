import { get } from 'lodash'
import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'
import parentSubscriptionWhitelistedRoutes from '~/utils/consts/parentSubscriptionWhitelistedRoutes.json'
import routeHandlerIgnoredRoutes from '~/utils/consts/routeHandlerIgnoredRoutes.json'

export default function ({ redirect, route, store }) {
  const user = store.getters['auth/getUserInfo']
  const isLoggedIn = store.getters['auth/checkAuth']
  const isAppRoute = /^app-.*$/.test(route.name)
  const isAdminRoute = /^admin.*$/.test(route.name)
  const isUnauthenticatedRoute = !!unauthenticatedRoutes[route.name]

  if (routeHandlerIgnoredRoutes[route.name]) {
    return
  }

  const shouldRedirectUser =
    isLoggedIn &&
    !!user.id &&
    !!user.role &&
    route.query.process !== 'signup'

  if (!shouldRedirectUser) {
    return
  }

  const isAdminRole = get(user, 'role.section') === 'ADMIN'
  const isUserRole = get(user, 'role.section') === 'USERS'

  if ((isUnauthenticatedRoute || isAppRoute) && isAdminRole) {
    get(user, 'role.name') === 'SPECIALISTS'
      ? redirect({ name: 'admin-agenda' })
      : redirect({ name: 'admin-curriculum-management' })
  } else if ((isUnauthenticatedRoute || isAdminRoute) && isUserRole) {
    redirect({ name: 'app-dashboard' })
  }

  const shouldRedirectToAccount =
    !parentSubscriptionWhitelistedRoutes[route.name] &&
    get(user, 'role.id') === 3 && // PARENT
    (!user.subscription || user.subscription.status === 'canceled')

  if (shouldRedirectToAccount) {
    redirect({ name: 'app-account-index' })
  }
}
