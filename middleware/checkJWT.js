export default async function ({ store, route, req, app }) {
  if (route.name === 'shared-slug') {
    return
  }

  /** SERVER SIDE */
  if (process.server) {
    const cookie = app.$cookies.getAll(req.headers.cookie)
      .find(record => record.name === 'atoken')

    if (!cookie) {
      return
    }
    // try to do auth
    await store.dispatch('auth/setToken', cookie.value)

  /** CLIENT SIDE */
  } else {
    const isLoggedIn = await store.dispatch('auth/checkAuth')

    // If the user is not authenticated check if we can restore his session
    if (!isLoggedIn) {
      await store.dispatch('auth/restoreAuthFromSessionStorage')
    }
  }
}
