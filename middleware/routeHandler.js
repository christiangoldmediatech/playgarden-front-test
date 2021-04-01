import { get } from 'lodash'
import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'
import parentSubscriptionWhitelistedRoutes from '~/utils/consts/parentSubscriptionWhitelistedRoutes.json'
import routeHandlerIgnoredRoutes from '~/utils/consts/routeHandlerIgnoredRoutes.json'

export default async function ({ redirect, route, store, app, req }) {
  const isIgnoredRoute = !!routeHandlerIgnoredRoutes[route.name]

  if (isIgnoredRoute) {
    return
  }

  const token = store.getters['auth/getAccessToken']
  const isUnauthenticatedRoute = !!unauthenticatedRoutes[route.name]
  const user = store.getters['auth/getUserInfo']
  const isUserInStore = store.getters['auth/isUserLoggedIn']

  let isLoggedIn = await store.dispatch('auth/checkAuth', undefined, { root: true })

  /**
   * FETCH AUTH AND PICK CHILD IF MISSING
   */

  if (route.name !== 'shared-slug') {
    /** SERVER SIDE */
    if (process.server && !isLoggedIn) {
      const cookie = app.$cookies.getAll(req.headers.cookie)
        .find(record => record.name === 'atoken')

      if (cookie) {
        await store.dispatch('auth/setToken', cookie.value)
      }
    }

    /** CLIENT SIDE */
    if (process.client && !isLoggedIn) {
      await store.dispatch('auth/restoreAuthFromSessionStorage', undefined, { root: true })
    }
  }

  isLoggedIn = await store.dispatch('auth/checkAuth', undefined, { root: true })

  if (isLoggedIn) {
    if (!isUserInStore) {
      await store.dispatch('auth/fetchUserInfo', undefined, { root: true })
    }

    const didRedirect = await store.dispatch('pickChild', {
      $router: { push: redirect },
      $route: route,
      req,
      $cookies: app.$cookies
    }, { root: true })
    // if a redirect to pick child is done, we want to stop the middleware here
    if (didRedirect) {
      return
    }
  } else if (isUnauthenticatedRoute) {
    await store.dispatch('auth/logout', undefined, { root: true })
  } else {
    await store.dispatch('auth/logout', redirect, { root: true })
  }

  /**
   * ROLE REDIRECT
   */

  const shouldRedirectUser =
    token &&
    isLoggedIn &&
    !!user.id &&
    !!user.role &&
    route.query.process !== 'signup' &&
    ![
      'auth-verify-email',
      'auth-verify-playdate',
      'help',
      'jwt-recovery',
      'privacy-policy',
      'terms-conditions',
      'shared-slug'
    ].includes(route.name)

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
   * CANCELED SUBSCRIPTION REDIRECT
   */

  const shouldRedirectToAccount =
    !parentSubscriptionWhitelistedRoutes[route.name] &&
    get(user, 'role.id') === 3 /* PARENT */ &&
    (!user.subscription || user.subscription.status === 'canceled')

  if (shouldRedirectToAccount) {
    return redirect({ name: 'app-account-index' })
  }

  /**
   * EMAIL VERIFIED REDIRECT
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
