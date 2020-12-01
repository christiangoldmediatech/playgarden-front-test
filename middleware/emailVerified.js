export default function ({ redirect, route, store }) {
  if (process.client) {
    console.log('on emailVerified')
    const user = store.getters['auth/getUserInfo']

    const ignoreRoute = {
      'auth-logout': 1,
      'jwt-recovery': 1
    }

    if (
      user.id &&
      user.validatedDate &&
      route.name === 'auth-verify-email' &&
      !ignoreRoute[route.name]
    ) {
      console.log('redirecting to dashboard')
      redirect({ name: 'app-dashboard' })
    }
  }
}
