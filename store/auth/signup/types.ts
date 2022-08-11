import { User } from '@/composables/users/types/user.type'

export type SignupPayload = Partial<User> & {
  password?: string
  passwordConfirmation?: string
}
