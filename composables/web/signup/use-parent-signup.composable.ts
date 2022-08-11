import { SignupType } from '@/models'
import { UseParentSignupOptions } from './types/use-parent-signup-options.type'

export const useParentSignup = ({
  store,
  auth,
  signupFlow
}: UseParentSignupOptions) => {
  async function signup(data: { signupType: SignupType }) {
    if (!auth.isUserLoggedIn.value) {
      data.signupType = SignupType.PLAYGARDEN
      await store.signup({ ...data, flow: signupFlow.abFlow.value })
    }
  }

  return {
    signup
  }
}
