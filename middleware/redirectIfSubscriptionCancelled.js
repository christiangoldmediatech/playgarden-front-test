import { get } from 'lodash'
import dayjs from 'dayjs'

export default function ({ redirect, route, store }) {
  if (/^app-.*$/.test(route.name) && process.client) {
    const whiteList = {
      'auth-logout': 1,
      'auth-verify-email': 1,
      'auth-verify-playdate': 1,
      'app-pick-child': 1,
      'app-account-index': 1,
      'app-inactive-subscription': 1,
      'app-children-register': 1,
      'app-children': 1,
      'app-payment': 1,
      'app-onboarding': 1,
      'app-payment-plan': 1,
      'app-payment-register': 1,
      'auth-singup-social-network': 1
    }
    const userInfo = store.getters['auth/getUserInfo']
    const suscription = userInfo.subscription
    const datetime = dayjs.unix(suscription.current_period_end)
    const days = dayjs(datetime).diff(new Date(), 'days')

    if (!whiteList[route.name] && get(userInfo, 'role.id') === 3) {
      // user doesn't has a subscription
      if ((!userInfo || !userInfo.subscription) && days <= 0) {
        redirect('/app/inactive-subscription')
      } else if ((userInfo.subscription.status === 'canceled' || userInfo.subscription.status === 'incomplete_expired') && days <= 0) {
        // check if subscription is cancelled, if so redirect
        redirect('/app/inactive-subscription')
      }
    }
  }
}
