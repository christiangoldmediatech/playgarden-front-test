import { CookieHandlerUI } from '@/utils/cookies'

export default (context, inject) => {
  return inject('cookies', CookieHandlerUI)
}
