import { get } from 'lodash'

export default function ({ redirect, route, store }) {
  if (process.client) {
    console.log('on redirectProperAuthenticatedSection')
    const user = store.getters['auth/getUserInfo']

    if (
      user.id &&
      /^admin.*$/.test(route.name) &&
      get(user, 'role.section') === 'USERS'
    ) {
      console.log('redirecting to dashboard')
      redirect({ name: 'app-dashboard' })
    } else if (
      user.id &&
      /^app-.*$/.test(route.name) &&
      get(user, 'role.section') === 'ADMIN'
    ) {
      console.log('redirecting to admin curriculum management')
      redirect({ name: 'admin-curriculum-management' })
    }
  }
}
