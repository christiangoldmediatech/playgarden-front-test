export default function ({ redirect, route, store }) {
  const whiteList = [
    'app-pick-child',
    'app-account',
    'app-profile'
  ]

  const child = store.getters.currentChild

  // If no child is selected
  if (!child && !whiteList.includes(route.name)) {
    redirect(`/app/pick-child?redirect=${encodeURIComponent(route.fullPath)}`)
  }
}
