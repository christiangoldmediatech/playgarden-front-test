import { Entity } from '@/models'

export interface Role extends Entity {
  id: number
  name: 'PARENTS'
  section: 'USERS'
}

export interface PlanSelected extends Entity {
  anualStripeId: string
  commonBenefits: {
    benefits?: string[]
  }
  homeDeliveryBenefits?: {
    benefits?: string[]
  }
  monthlyStripeId: string
  name: string
  planName: string
  plusBenefits?: {
    benefits?: string[]
  }
}

export interface User extends Entity {
  email: string
  firstName: string
  flow: 'CREDITCARD'
  fullName: string
  gclId?: string
  lastName: string
  onboardingDone: boolean
  phoneNumber?: string
  planChoosen: boolean
  planSelected: PlanSelected
  registerStep: number
  registerStepType: 'COMPLETED'
  role: Role
  shipments: unknown
  socialNetwork: 'GOOGLE'
  socialNetworkId: string
  specialists: unknown
  status: number
  statusType: 'TRIAL'
  stripeStatus: 'active'
  subscription: unknown
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
