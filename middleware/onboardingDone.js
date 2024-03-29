import { get } from 'lodash'

export default function ({ redirect, route, store }) {
  if (/^app-.*$/.test(route.name) && process.client) {
    const user = store.getters['auth/getUserInfo']

    const ignoreRoute = {
      'auth-logout': 1,
      'auth-verify-email': 1,
      'auth-verify-playdate': 1,
      'app-account-index': 1,
      'app-inactive-subscription': 1,
      'app-children-register': 1,
      'app-children': 1,
      'app-payment': 1,
      'app-onboarding': 1,
      'app-payment-plan': 1,
      'app-payment-register': 1
    }

    if (
      user.id &&
      !user.onboardingDone &&
      !ignoreRoute[route.name] &&
      (get(user, 'role.name') === 'PARENTS' ||
        get(user, 'role.name') === 'CAREGIVERS')
    ) {
      redirect({ name: 'app-onboarding' })
    }
  }
}
