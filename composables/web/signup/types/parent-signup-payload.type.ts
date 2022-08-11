import { SignupType } from '@/composables/users/types/signup-type.type'
import { User } from '@/composables/users/types/user.type'

export type ParentSignupPayload = Partial<User> & {
  signupType: SignupType
  password?: string
  passwordConfirmation?: string
}
