import { SignupType } from '@/models'
import { ParentSignupPayload, UseParentSignupOptions } from './types'

export const useParentSignup = ({
  store,
  auth,
  signupFlow
}: UseParentSignupOptions) => {
  async function signup(data: ParentSignupPayload) {
    if (!auth.isUserLoggedIn.value) {
      data.signupType = SignupType.PLAYGARDEN
      await store.signup({ ...data, flow: signupFlow.abFlow.value })
    }
  }

  return {
    signup
  }
}
