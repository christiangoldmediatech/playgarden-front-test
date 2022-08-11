import { SignupType } from '@/models'
import { ParentSignupPayload } from './types/parent-signup-payload.type'
import { UseParentSignupOptions } from './types/use-parent-signup-options.type'

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
