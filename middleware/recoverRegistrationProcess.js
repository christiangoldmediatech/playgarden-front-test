import { get } from 'lodash'
import { UserFlow } from '@/models'

export default function ({ redirect, route, store }) {
  const ignoreRoute = {
    'auth-logout': 1,
    help: 1,
    'jwt-recovery': 1,
    'auth-singup-social-network': 1,
    'privacy-policy': 1,
    'terms-conditions': 1,
    'shared-slug': 1
  }

  // PARENT_INFORMATION = 1 -> Enter parent info page <- sign up
  // PAYMENT_INFORMATION = 2 -> Enter children information page
  // CHILDREN_INFORMATION = 3 -> Enter plan selection page
  // VERIFICATION = 5 -> Enter email verifciation page <- covered by "emailVerified" middleware
  // COMPLETED = 6 -> Completed <- no action

  const user = store.getters['auth/getUserInfo']
  const step = Number(user.registerStep)
  const isLoggedIn = store.getters['auth/isUserLoggedIn']
  const isIgnoredRoute = Boolean(ignoreRoute[route.name])
  const isInSignupProcess = route.query.process === 'signup'
  const isValidRole = !user.role || get(user, 'role.section') === 'USER'
  const isValidRegisterStep = step === 1 || step === 2 || step === 3 || (step === 5 && user.flow === UserFlow.NOCREDITCARD)

  if (isLoggedIn && isValidRegisterStep && isValidRole && !isInSignupProcess && !isIgnoredRoute) {
    const planPage = { name: 'app-payment-plan', query: { process: 'signup', step: '2' } }
    const finishedFirstStep = [1, 2].includes(step)

    let redirectTo

    if (finishedFirstStep) {
      redirectTo = planPage
    }

    if (redirectTo) {
      redirect(redirectTo)
    }
  }
}
