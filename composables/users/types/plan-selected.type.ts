import { Entity } from '@/composables/common/types'

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
