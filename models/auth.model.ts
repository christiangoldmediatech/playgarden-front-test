/* eslint-disable camelcase */
import { UserFlow } from '@/models'

export enum SignupType {
  LEARN_AND_PLAY = 'LEARN_AND_PLAY',
  PLAYGARDEN = 'PLAYGARDEN'
}
export interface SignupData {
  email: string
  firstName: string
  lastName: string
  flow: UserFlow
  phoneNumber?: string
  signupType: SignupType,
  promotion_id?: string
  password?: string
  passwordConfirmation?: string
  socialNetwork?: string
  socialNetworkId?: string
}
