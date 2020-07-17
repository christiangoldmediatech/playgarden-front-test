export default async function ({ store, redirect, route }) {
  if (process.server) {
    return redirect(`/jwt-recovery?redirect=${encodeURIComponent(route.fullPath)}`)
  } else {
    const isLoggedIn = await store.dispatch('auth/checkAuth')
    // If the user is not authenticated check if we can restore his session
    if (!isLoggedIn) {
      await store.dispatch('auth/restoreAuthFromSessionStorage')
    }
  }
}