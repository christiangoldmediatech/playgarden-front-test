import { useAccessorHelper } from '@/composables/helpers.composable'
import { useAuth } from '@/composables/users'
import { Flow } from '@/composables/users/enums'
import { SignupType } from '@/composables/users/types'
import { useParentSignup } from './use-parent-signup.composable'
import { useSignupFlow } from './use-signup-flow.composable'

jest.mock('@/composables/helpers.composable')

const auth = {
  isUserLoggedIn: { value: false }
} as unknown as ReturnType<typeof useAuth>

const signupFlow = {
  abFlow: { value: Flow.NOCREDITCARD }
} as unknown as ReturnType<typeof useSignupFlow>

describe('useParentSignup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signup', () => {
    describe('Given there is a signup flow', () => {
      it('should use the given signup flow', async () => {
        const parentSignup = useParentSignup({ auth, signupFlow })

        await parentSignup.signup(
          { signupType: SignupType.PLAYGARDEN },
          SignupType.PLAYGARDEN
        )

        expect(useAccessorHelper().auth.signup.signup).toHaveBeenCalledTimes(1)
        expect(useAccessorHelper().auth.signup.signup).toHaveBeenCalledWith({
          signupType: SignupType.PLAYGARDEN,
          flow: Flow.NOCREDITCARD
        })
      })
    })

    describe('Given there is no signup flow', () => {
      it('should use `CREDICARD` flow', async () => {
        const parentSignup = useParentSignup({ auth })

        await parentSignup.signup(
          { signupType: SignupType.PLAYGARDEN },
          SignupType.PLAYGARDEN
        )

        expect(useAccessorHelper().auth.signup.signup).toHaveBeenCalledTimes(1)
        expect(useAccessorHelper().auth.signup.signup).toHaveBeenCalledWith({
          signupType: SignupType.PLAYGARDEN,
          flow: Flow.CREDITCARD
        })
      })
    })
  })
})
