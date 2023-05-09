import { get } from 'lodash'
import dayjs from 'dayjs'
import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'
import parentSubscriptionWhitelistedRoutes from '~/utils/consts/parentSubscriptionWhitelistedRoutes.json'
import routeHandlerIgnoredRoutes from '~/utils/consts/routeHandlerIgnoredRoutes.json'

export default async function ({ redirect, route, store, app, req }) {
  const redirectLogout = (route.query.logout)

  if (redirectLogout) {
    return redirect({ name: 'auth-logout' })
  }

  const isIgnoredRoute = !!routeHandlerIgnoredRoutes[route.name]

  if (isIgnoredRoute) {
    return
  }

  let user = store.getters['auth/getUserInfo']
  const isRegistrationComplete = store.getters['auth/isRegistrationComplete']

  const token = store.getters['auth/getAccessToken']
  const isUnauthenticatedRoute = !!unauthenticatedRoutes[route.name]
  const isUserInStore = store.getters['auth/isUserLoggedIn']

  let isLoggedIn = await store.dispatch('auth/checkAuth', undefined, { root: true })

  if (!isRegistrationComplete) {
    await store.dispatch('auth/cleanChildren')
  }

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

  const noUserFlow = route.query.noUserFlow
  if (noUserFlow && route.name === 'app-payment-iframe-plan') {
    return
  }

  isLoggedIn = await store.dispatch('auth/checkAuth', undefined, { root: true })

  if (route.name === 'app-payment-iframe-plan' && !route.query.isLogged && isLoggedIn) {
    return redirect({ name: 'app-payment-iframe-plan', query: { isLogged: true } })
  } else if (route.name === 'app-payment-iframe-plan') {
    return
  }

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
    await store.dispatch('auth/logout', {}, { root: true })
  } else {
    await store.dispatch('auth/logout', { redirect, route: route.fullPath }, { root: true })
  }

  user = store.getters['auth/getUserInfo']

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

  const goToPage = (user) => {
    if (user.stripeStatus === 'active' && user.registerStep > 3) {
      if (user.planSelected.id === 2 || user.planSelected.id === 3) {
        return 'app-virtual-preschool'
      }

      if (user.planSelected.id === 1) {
        // return 'app-learn-play'
        return 'app-virtual-preschool'
      }
    } else if (user.registerStep > 3) {
      return 'app-virtual-preschool'
    }
  }

  /**
   * ROLE REDIRECT
   */

  const isAppRoute = /^app-.*$/.test(route.name)
  const isAdminRoute = /^admin.*$/.test(route.name)
  const isAdminRole = get(user, 'role.section') === 'ADMIN'
  const isUserRole = get(user, 'role.section') === 'USERS'

  if ((isUnauthenticatedRoute || isAppRoute) && isAdminRole) {
    const atoken = store.getters['auth/getAccessToken']
    window.open(
      `${process.env.playgardenAdminUrl}?atoken=${atoken}`,
      '_self'
    )
    return
  } else if ((isUnauthenticatedRoute || isAdminRoute) && isUserRole) {
    return redirect({ name: goToPage(user) })
  }

  /**
   * CANCELED SUBSCRIPTION REDIRECT
   */

  const shouldRedirectToAccount =
    !parentSubscriptionWhitelistedRoutes[route.name] &&
    get(user, 'role.id') === 3 /* PARENT */ &&
    (user?.subscription?.status === 'canceled' || user?.subscription?.status === 'incomplete_expired')
  const suscription = user.subscription

  if (suscription) {
    const datetime = dayjs.unix(suscription.current_period_end)
    const days = dayjs(datetime).diff(new Date(), 'days')

    if (shouldRedirectToAccount && (days < 0 || user.accessCancelled)) {
      return redirect({ name: 'app-inactive-subscription' })
    }
  }

  /**
   * EMAIL VERIFIED REDIRECT
   */

  const shouldRedirectToVirtualPreschool =
    user.id &&
    user.validatedDate &&
    route.name === 'auth-verify-email' &&
    !['auth-logout', 'jwt-recovery'].includes(route.name)

  if (shouldRedirectToVirtualPreschool) {
    return redirect({ name: 'app-virtual-preschool' })
  }
}
