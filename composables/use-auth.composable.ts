import { computed, ref } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'
import dayjs from 'dayjs'
// @ts-ignore
import jwtDecode from 'jwt-decode'
import { useCookiesHelper, useChild } from '@/composables'
import { hasLocalStorage } from '@/utils/window'
import { axios } from '@/utils'
import { SignupData, TypedStore, User, Plan } from '@/models'
import { useNotification } from './use-notification.composable'

export const useAuth = ({ store }: { store: Store<TypedStore> }) => {
  const cookies = useCookiesHelper()
  const plan = ref<Plan | null>(null)

  const accessToken = computed(() => store.state.auth.accessToken)
  const setAccessToken = (val: string | null) => {
    store.commit('auth/SET_ACCESS_TOKEN', val)
  }

  const expiresAt = computed(() => store.state.auth.expiresAt)
  const setExpiresAt = (val: number | null) => {
    store.commit('auth/SET_EXPIRES_AT', val)
  }

  const issuedAt = computed(() => store.state.auth.issuedAt)
  const setIssuedAt = (val: number | null) => {
    store.commit('auth/SET_ISSUED_AT', val)
  }

  const setAxiosToken = (val: string | null) => {
    if (typeof val === 'string') {
      axios.setToken(val, 'Bearer')
    }
  }

  const playdateInvitationToken = computed(
    () => store.state.auth.playdateInvitationToken
  )
  const setPlaydateInvitationToken = (val: string | null) => {
    store.commit('auth/SET_PLAYDATE_INVITATION_TOKEN', val)
  }

  const userInfo = computed(() => store.state.auth.userInfo)
  const setUserInfo = (val: User) => {
    store.commit('auth/SET_USER_INFO', val)
  }

  const isUserInSignupProcess = computed<boolean>(
    () => (userInfo.value.registerStep || 0) < 5
  )

  const isUserEmailVerified = computed<boolean>(
    () => store.getters['auth/isUserEmailUnverified']
  )

  const isUserInTrial = computed<boolean>(() => {
    return userInfo.value.stripeStatus === 'trialing'
  })

  const checkAuth = (): boolean => {
    return (
      !!(accessToken.value && expiresAt.value) && Date.now() < expiresAt.value
    )
  }

  const setToken = (token?: string | null) => {
    if (!token || token === 'removed') {
      return
    }

    const auth = jwtDecode<{ exp: number; iat: number }>(token)

    if (process.client) {
      cookies.remove('atoken')
      cookies.add({ _key: 'atoken', _data: token, _maxAge: auth.exp })
    }

    setAccessToken(token)
    setAxiosToken(token)
    setIssuedAt(auth.iat)
    setExpiresAt(auth.exp * 1000)

    if (hasLocalStorage()) {
      window.localStorage.setItem('authToken', JSON.stringify(token))
    }
  }

  const restoreAuthFromSessionStorage = () => {
    if (!hasLocalStorage()) {
      return
    }

    const token = window.localStorage.getItem('authToken')

    setToken(token)
  }

  const resetState = () => {
    setAccessToken(null)
    setExpiresAt(null)
    setIssuedAt(null)
    setUserInfo({} as User)
    setAxiosToken('')
  }

  const logout = (redirectOptions?: {
    route: string
    redirect: (options: any) => void
  }) => {
    const { currentChildren, resetCurrentChildren } = useChild({
      store,
      cookies
    })
    const {
      notificationCard,
      setNotificationCard,
      isTrialExpiringRibbonVisible,
      setIsTrialExpiringRibbonVisible
    } = useNotification({ store })

    resetState()

    if (process.client) {
      cookies.remove('atoken')
    }

    if (hasLocalStorage()) {
      window.localStorage.removeItem('authToken')
    }

    if (currentChildren.value?.length) {
      resetCurrentChildren()
    }

    if (notificationCard.value.isVisible) {
      setNotificationCard({
        ...notificationCard.value,
        isVisible: false
      })
    }

    if (isTrialExpiringRibbonVisible.value) {
      setIsTrialExpiringRibbonVisible(false)
    }

    if (
      redirectOptions &&
      typeof redirectOptions === 'object' &&
      Object.prototype.hasOwnProperty.call(redirectOptions, 'redirect')
    ) {
      if (Object.prototype.hasOwnProperty.call(redirectOptions, 'route')) {
        redirectOptions.redirect({
          name: 'index',
          query: { redirect: encodeURIComponent(redirectOptions.route) }
        })
      } else {
        redirectOptions.redirect({ name: 'index' })
      }
    }
  }

  const isUserLoggedIn = computed(() => Boolean(userInfo.value.id))

  const fetchUserInfo = async () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const params = { timezone }
    const { data } = await axios.get('/auth/me', { params })
    setUserInfo(data)
  }

  const updateUserInfo = async (
    draft: Pick<User, 'firstName' | 'lastName' | 'phoneNumber'>
  ) => {
    const { data } = await axios.patch('/auth/me/edit', draft)
    setUserInfo(data)
  }

  const updateAuthOnboarding = async () => {
    await axios.patch('/auth/onboarding')
    await fetchUserInfo()
  }

  const getPlan = async () => {
    const { data } = await axios.get('/auth/user/plan')
    plan.value = data.plan
  }

  const signup = (signupData: SignupData): Promise<User> => {
    return store.dispatch('auth/signup/signup', signupData)
  }

  return {
    accessToken,
    userInfo,
    isUserLoggedIn,
    isUserEmailVerified,
    isUserInSignupProcess,
    isUserInTrial,
    plan,
    checkAuth,
    setToken,
    logout,
    restoreAuthFromSessionStorage,
    fetchUserInfo,
    updateUserInfo,
    updateAuthOnboarding,
    signup,
    getPlan
  }
}
