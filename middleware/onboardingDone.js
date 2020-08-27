export default function ({ redirect, route, store }) {
  if (/^app-.*$/.test(route.name) && process.client) {
    const user = store.getters['auth/getUserInfo']

    const ignoreRoute = {
      'auth-logout': 1,
      'auth-verify-email': 1,
      'app-account': 1,
      'app-onboarding': 1
    }

    if (
      user.id &&
      !user.onboardingDone &&
      !ignoreRoute[route.name] &&
      (user.role.name === 'PARENTS' || user.role.name === 'CAREGIVERS')
    ) {
      redirect({ name: 'app-onboarding' })
    }
  }
}
