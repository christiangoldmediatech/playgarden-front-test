export default async function ({ store, redirect, route, req, app }) {
  const ignore = {
    'shared-slug': 1
  }

  if (!ignore[route.name]) {
    if (process.server) {
      const cookies = app.$cookies.getAll(req.headers.cookie)

      for (let index = 0; index < cookies.length; index++) {
        const cookie = cookies[index]
        if (cookie.name === 'atoken') {
          // Try doing auth
          await store.dispatch('auth/setToken', cookie.value)
        }
      }

      const isLoggedIn = await store.dispatch('auth/checkAuth')

      if (!isLoggedIn) {
        return redirect(
          `/jwt-recovery?redirect=${encodeURIComponent(route.fullPath)}`
        )
      }
    } else {
      const isLoggedIn = await store.dispatch('auth/checkAuth')
      // If the user is not authenticated check if we can restore his session
      if (!isLoggedIn) {
        await store.dispatch('auth/restoreAuthFromSessionStorage')
      }
    }
  }
}
