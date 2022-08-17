import { Entity } from '@/composables/common/types'
import { Flow } from '../enums'
import { PlanSelected, Role, Subscription } from './'

export interface User extends Entity {
  email: string
  firstName: string
  flow: Flow
  fullName: string
  gclId?: string
  lastName: string
  onboardingDone: boolean
  phoneNumber?: string
  promotionCode?: string
  promotionId?: string
  planChoosen: boolean
  planSelected: PlanSelected
  planId: number
  registerStep: number
  registerStepType: 'COMPLETED'
  role: Role
  shipments: unknown
  socialNetwork: 'GOOGLE'
  socialNetworkId: string
  specialists: unknown
  status: number
  statusType: 'TRIAL'
  stripeStatus: 'active' | 'trialing'
  subscription?: Subscription
  testUser: boolean
  trial: boolean
  trialEnd: string
  utmCampaign?: string
  utmMedium?: string
  utmName?: string
  utmSource?: string
  utmTerm?: string
  validatedDate: unknown
}
