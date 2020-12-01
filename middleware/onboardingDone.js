import { get } from 'lodash'

export default function ({ redirect, route, store }) {
  if (/^app-.*$/.test(route.name) && process.client) {
    console.log('on onboardingDone')
    const user = store.getters['auth/getUserInfo']

    const ignoreRoute = {
      'auth-logout': 1,
      'auth-verify-email': 1,
      'app-account': 1,
      'app-children-register': 1,
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
      console.log('redirecting to dashbaord')
      redirect({ name: 'app-onboarding' })
    }
  }
}
