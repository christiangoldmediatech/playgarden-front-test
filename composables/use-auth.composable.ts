import { computed, ref } from '@nuxtjs/composition-api'
// @ts-ignore
import jwtDecode from 'jwt-decode'
import { useCookiesHelper } from '@/composables'
import { hasLocalStorage } from '@/utils/window'
import { axios } from '@/utils'
import { User } from '@/models'

const accessToken = ref<string | null>(null)
const axiosToken = ref<string | null>(null)
const expiresAt = ref<number | null>(null)
const issuedAt = ref<number | null>(null)
const playdateInvitationToken = ref<string | null>(null)

const userInfo = ref({} as User)

export const useAuth = () => {
  const cookies = useCookiesHelper()

  const checkAuth = (): boolean => {
    return !!(accessToken.value && expiresAt.value) && (Date.now() < expiresAt.value)
  }

  const setToken = (token?: string | null) => {
    if (!token || token === 'removed') {
      return
    }

    const auth = jwtDecode(token)

    if (process.client) {
      cookies.remove('atoken')
      cookies.add({ _key: 'atoken', _data: token, _maxAge: auth.exp })
    }

    accessToken.value = token
    axiosToken.value = token
    issuedAt.value = auth.iat
    expiresAt.value = auth.exp * 1000

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

  const isUserLoggedIn = computed(() => Boolean(userInfo.value.id))

  const fetchUserInfo = async () => {
    const { data } = await axios.get('/auth/me')

    userInfo.value = data
  }

  const updateUserInfo = async (draft: Pick<User, 'firstName' | 'lastName' | 'phoneNumber'>) => {
    const { data } = await axios.patch('/auth/me/edit', draft)

    userInfo.value = data
  }

  const updateAuthOnboarding = async () => {
    await axios.patch('/auth/onboarding')
    await fetchUserInfo()
  }

  return {
    userInfo,
    isUserLoggedIn,
    checkAuth,
    setToken,
    restoreAuthFromSessionStorage,
    fetchUserInfo,
    updateUserInfo,
    updateAuthOnboarding
  }
}
