/* eslint-disable camelcase */
import { UserFlow } from '@/models'

export interface SignupData {
  email: string
  firstName: string
  lastName: string
  flow: UserFlow
  phoneNumber?: string
  promotion_id?: string
  password?: string
  passwordConfirmation?: string
  socialNetwork?: string
  socialNetworkId?: string
}
