import { SignupType, User } from '@/composables/users/types'

export type ParentSignupPayload = Partial<User> & {
  signupType: SignupType
  password?: string
  passwordConfirmation?: string
}
