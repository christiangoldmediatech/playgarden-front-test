export default function ({ redirect, route, store }) {
  if (process.client) {
    const user = store.getters['auth/getUserInfo']

    if (
      user.id &&
      /^admin.*$/.test(route.name) &&
      user.role.section === 'USERS'
    ) {
      redirect({ name: 'app-dashboard' })
    } else if (
      user.id &&
      /^app-.*$/.test(route.name) &&
      user.role.section === 'ADMIN'
    ) {
      redirect({ name: 'admin-curriculum-management' })
    }
  }
}
