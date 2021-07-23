export default function ({ redirect, route, store }) {
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
    redirect({ name: 'app-virtual-preschool' })
  }
}
