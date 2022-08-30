import { useAccessorHelper } from '@/composables/helpers.composable'
import { Flow } from '@/composables/users/enums'
import { SignupType } from '@/models'
import { ParentSignupPayload, UseParentSignupOptions } from './types'

export const useParentSignup = ({
  auth,
  signupFlow
}: UseParentSignupOptions) => {
  const store = useAccessorHelper().auth.signup

  async function signup(data: ParentSignupPayload, signupType: SignupType) {
    const defaultSignupFlow = signupFlow?.abFlow.value || Flow.CREDITCARD

    if (!auth.isUserLoggedIn.value) {
      data.signupType = signupType
      await store.signup({ ...data, flow: defaultSignupFlow })
    }
  }

  return {
    signup
  }
}
