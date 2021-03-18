import { get } from 'lodash'

export default function ({ redirect, route, store }) {
  const user = store.getters['auth/getUserInfo']

  if (
    user.id &&
    /^admin.*$/.test(route.name) &&
    get(user, 'role.section') === 'USERS'
  ) {
    redirect({ name: 'app-dashboard' })
  } else if (
    user.id &&
    /^app-.*$/.test(route.name) &&
    get(user, 'role.section') === 'ADMIN'
  ) {
    if (get(user, 'role.name') === 'SPECIALISTS') {
      redirect({ name: 'admin-agenda' })
    } else {
      redirect({ name: 'admin-curriculum-management' })
    }
  }
}
