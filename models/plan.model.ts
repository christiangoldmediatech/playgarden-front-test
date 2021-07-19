import { Entity } from '@/models'

export interface PlanFeacture {
    benefits: string []
    promotions?: string []
  }

export interface Plan extends Entity {
    name: string
    planName: string
    commonBenefits: PlanFeacture
    homeDeliveryBenefits: PlanFeacture,
    plusBenefits: PlanFeacture
    monthlyStripeId: string
    anualStripeId: string
}

export interface PlanResponse {
  text: string
  value: number
}
