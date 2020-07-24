export default function ({ redirect, route, store }) {
  if (process.client) {
    const user = store.getters['auth/getUserInfo']

    if (
      user.id &&
      !user.validatedDate &&
      route.name !== 'auth-logout' &&
      route.name !== 'auth-verify-email' &&
      route.name !== 'jwt-recovery' &&
      route.query.process !== 'signup' &&
      (user.role.name === 'PARENTS' || user.role.name === 'CAREGIVERS')
    ) {
      redirect({ name: 'auth-verify-email' })
    } else if (
      user.id &&
      user.validatedDate &&
      route.name === 'auth-verify-email' &&
      route.name !== 'jwt-recovery'
    ) {
      redirect({ name: 'app-dashboard' })
    }
  }
}
