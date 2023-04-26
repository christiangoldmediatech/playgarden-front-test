/* eslint-disable camelcase */
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

export interface Subscription extends Entity {
  application_fee_percent: unknown
  billing_cycle_anchor: number
  billing_thresholds: unknown
  cancel_at: unknown
  cancel_at_period_end: boolean
  canceled_at: unknown
  collection_method: 'charge_automatically'
  created: number
  current_period_end: number
  current_period_start: number
  customer: string
  days_until_due: unknown
  default_payment_method: unknown
  default_source: unknown
  default_tax_rates: []
  discount: unknown
  ended_at: unknown
  items: unknown
  latest_invoice: string
  livemode: boolean
  metadata: unknown
  next_pending_invoice_item_invoice: unknown
  object: 'subscription'
  pause_collection: unknown
  pending_invoice_item_interval: unknown
  pending_setup_intent: unknown
  pending_update: unknown
  plan: unknown
  quantity: 1
  schedule: unknown
  start_date: number
  status: 'active'
  transfer_data: unknown
  trial_end: number
  trial_start: number
}

export enum UserFlow {
  CREDITCARD = 'CREDITCARD',
  NOCREDITCARD = 'NOCREDITCARD'
}

export enum UserRole {
  SUPER_ADMIN = 1,
  PARENTS = 3
}

export interface User extends Entity {
  email: string
  firstName: string
  flow: UserFlow
  hasCreditCards: boolean
  fullName: string
  gclId?: string
  lastName: string
  onboardingDone: boolean
  phoneNumber?: string
  promotionCode?: string
  promotionId?: string
  planChoosen: boolean
  planSelected: PlanSelected
  planId: number,
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
  accountCancelled: boolean
}
